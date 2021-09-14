/** @format */

/* 

    Import dependencies

*/

import fs from 'fs/promises';
import puppeteer from 'puppeteer';
import { Schema } from './schema.mjs';
import { ParseHTMLForNode } from './htmlParser.mjs';

/*

    The URL the data should be crawled for

*/

const dataSourceUrl =
	'https://www.lgl.bayern.de/gesundheit/infektionsschutz/infektionskrankheiten_a_z/coronavirus/karte_coronavirus/index.htm';

/*

    The paths used to determine data storge locations

*/

const Paths = {
	current: './data/current.json',
	history: './data/history.json',
};

/*

    The value that will be used as a refresh time
    - this value is by default 1 hour or 3600000ms

*/

const timeToRefresh = 3600000;

/*

	@description method to check if the history object should be updated. This is done by comparing the newly created data set's timestamp against the timestamp of the last object in the history. 

	@param { Object } newData - the newly created data object
	@param { Object } lastData - the last dataSet contained in the history object

	@returns { Boolean } indicates true if update is needed

*/

const checkForHistoryRefresh = (newData, lastData) => {
	// create a new Date out of the provideed lastData object

	const oldDateRaw = lastData?.meta?.dataCurrentAsOf || 0;
	const oldDate = new Date(oldDateRaw).toLocaleDateString();

	const newDate = newData.meta.dataCurrentAsOf.toLocaleDateString();

	// if the dates do not match, a refresh is needed, return true

	return oldDate != newDate ? true : false;
};

/**

	@description method to extract the data from the provided htmlnodes using a hardcoded set of rules. -> stinks

	@param { HTMLCollection } nodeData - the nodes that contain the data
	@param { HTMLCollection } nodeTime - the nodes that should contain the time stamps for the data
	@param { Object } lastDataSet - the lastDataSet created

	@returns { Object } containing the newly parsed and cleaned up data

*/

const extractData = (nodeData, nodeTime, lastDataSet) => {
	/*

		Extract the table data as well as the concurrency info from the provided node object. This really sucks big time, seeing as the data has to be hardcoded and will likely break everytime the website is updated

	*/

	// for (let i = 0; i < nodeData.length; i++) {
	// 	const content = nodeData[i].textContent;

	// 	console.log({ content, i });
	// }

	const incidenceCurrentValue = parseFloat(
		nodeData[3].textContent.replace(',', '.')
	);
	const hospitalizationCurrentValue = parseInt(nodeData[1].textContent);
	const icuCurrentValue = parseInt(nodeData[13].textContent);
	const vaccinationCurrentValue = parseFloat(
		nodeData[27].textContent.replace(',', '.').replace('%', '')
	);

	/*

		The refresh time is extracted from the last node containing the "datum" class and checked for it's text content

	*/

	const dataRaw =
		nodeTime[2].textContent || nodeTime[2].childNodes[0].textcontent;

	/**

		@todo: Figure out a better way to get the concurrency timestamp. This will likely break when the website is updated.

	*/

	// const dataCurrentAsOf = dataRaw
	// 	.replace('3) Stand:', '')
	// 	.replace('Uhr. https://www.intensivregister.de', '');

	const dataCurrentAsOf = dataRaw
		.match(/Stand[0-9., :]*Uhr/gim)[0]
		.replace('Stand:', '')
		.replace('Uhr', '');

	console.log(dataCurrentAsOf);

	// check which historyObject to use

	const newDate = new Date(dataCurrentAsOf).getDay();
	const oldDate = new Date(
		lastDataSet.history[lastDataSet.history.length - 1].meta.dataCurrentAsOf
	).getDay();

	let mod = newDate == oldDate ? 1 : 2;

	/*

		Gather thee last Values and provide a fallback to zero if data is missing or corrupted 

	*/

	const incidenceLastValue =
		lastDataSet.history[lastDataSet.history.length - mod]?.incidence
			?.value || 0;
	const hospitalizationLastValue =
		lastDataSet.history[lastDataSet.history.length - mod]?.hospitalization
			?.value || 0;
	const icuLastValue =
		lastDataSet.history[lastDataSet.history.length - mod]?.icuOccupancy
			?.value || 0;
	const vaccinationLastValue =
		lastDataSet.history[lastDataSet.history.length - mod]?.vaccination
			?.value || 0;

	/*

		Create a new DataSet

	*/

	const newDataSet = new Schema({
		dataCurrentAsOf,
		incidenceCurrentValue,
		incidenceLastValue,
		hospitalizationCurrentValue,
		hospitalizationLastValue,
		icuCurrentValue,
		icuLastValue,
		vaccinationCurrentValue,
		vaccinationLastValue,
	});

	/*

		Return the export value from the schema

	*/

	return newDataSet.export();
};

/**

    @description method to crawl the dataSource for data and process it

	@param { Object } param1 - a Object containing properties is provided to the method to control execution
	@param { String } param1.forcerefresh - a string extracted from the req.body to check if a refresh should be forced

	@returns { Object } a object containg the requested data

*/

const fetchDataFromSource = async ({ forcerefresh = 'false' } = {}) => {
	/*

       	Retrieve and parse the stored current and history JSON data

    */

	const lastDataSetRaw = await fs.readFile(Paths.current);
	const lastDataSet = JSON.parse(lastDataSetRaw);

	const historyRaw = await fs.readFile(Paths.history);
	const history = JSON.parse(historyRaw);

	/*

        Create a new requestTimestamp to compare the lastUpdated timestamp against

    */

	const requestTimestamp = Date.now();

	/*

        Compare the timestamps against each other and if forceRefresh is false && the timestamp is younger then the timeToRefresh value, return the lastDataSet without parsing further

    */

	if (
		forcerefresh != 'true' &&
		requestTimestamp - timeToRefresh < lastDataSet?.meta?.timeStamp
	) {
		return lastDataSet;
	}

	/*

        Create a new puppeteer instance and navigate to the page specified in the dataSourceURL

    */

	const browser = await puppeteer.launch({
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});
	const page = await browser.newPage();
	await page.goto(dataSourceUrl);

	/*

    	Retrieve the Body and parse it into queryable DOMNodes

    */

	const dataBody = await page.content();
	const [nodeData, nodeTime] = ParseHTMLForNode(
		dataBody,
		'#wKennzahlen .blockelement tr > td',
		'#wKennzahlen .quellen p'
	);

	/*

		Close the browser instance

	*/

	await browser.close();

	/*

		create a new DataSet

	*/

	const newData = extractData(nodeData, nodeTime, history);

	// console.log(newDataSet);

	/*

		Check if the history should be updated, by comparing the concurency of the newDataSet and the last Histoy object

	*/

	const refreshNeeded = checkForHistoryRefresh(
		newData,
		history.history[history.history.length - 1]
	);

	/*

		If a refresh is needed, update the history object and write it to the json file

	*/

	if (refreshNeeded) {
		const newHistory = {
			lastUpdated: Date.now(),
			history: [...history.history, newData],
		};

		await fs.writeFile(Paths.history, JSON.stringify(newHistory));
	}

	/*

		Write the most current data to the json file

	*/

	await fs.writeFile(Paths.current, JSON.stringify(newData));

	/*

		Return the newData

	*/

	return newData;
};

const fetchHistory = async ({ timeframe = 7 }) => {
	// gather the history object

	const { history } = JSON.parse(await fs.readFile(Paths.history));

	/*

		Shorten or Pad the retrieved array to it's supposed length. 

	*/

	const constructedArray = [];
	constructedArray.length = timeframe;

	/* 

		Itterate over the new array and fill it with the corresponding data from the end of the history array

	*/

	for (let i = 0; i < timeframe; i++) {
		constructedArray[i] = history[history.length - timeframe + i];
	}

	return constructedArray;
};

export { fetchDataFromSource, fetchHistory };

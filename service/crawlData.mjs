/** @format */

/* 

    Import dependencies

*/

import fs from 'fs/promises';
import puppeteer from 'puppeteer';
import { Schema } from './schema.mjs';
import { ParseHTMLForNode } from './htmlParser.mjs';

// the URL to crawl

const endpoint =
	'https://www.lgl.bayern.de/gesundheit/infektionsschutz/infektionskrankheiten_a_z/coronavirus/karte_coronavirus/index.htm';

// the path of the storage Json file

const JSONPath = './data/data.json';

// The timeToRefresh Value

const timeToRefresh = 3600000;

/**

	@description methdo to extract data from a set of provided nodes. 

	@param { {} } param1 - the object passed to the method containing the properties used to extract the data
	@param { HTMLElement } param1.dataNodes - the HTMLElement containing the nodes with data
	@param { HTMLElement } param1.timeNodes - the HTMLElement containing the nodes with the last updated timestamp
	@param { [] } param1.history - the history array where new data is pushed to
	@param { {} } param1.mostCurrentDataSet - the object containing the data that is most current as of now

	@returns { {} } containing the most recent data sourcee
*/

const extractDataFromNodes = ({
	dataNodes,
	timeNodes,
	history,
	mostCurrentDataSet,
}) => {
	/*

		The commented part is a itterator to quickly check nodes for their content when the website layout changes

	*/

	// for (let i = 0; i < nodeData.length; i++) {
	// 	const content = nodeData[i].textContent;

	// 	console.log({ content, i });
	// }

	/**

        Process the timeNodes by extracting the textContent from the 3 Node found, which should contain the last updated icu cases. This is usually the last value updated and should be used to check if the last history object is outdated and the history should be refreshed.

        @attention as the values are hardcoded, this has potential to break if the layout of the source changes. 

    */

	const dateText =
		timeNodes[2].textContent || timeNodes[2].childNodes[0].textcontent;
	const dataCurrentAsOf = dateText
		.match(/Stand[0-9., :]*Uhr/gim)[0]
		.replace('Stand:', '')
		.replace('Uhr', '');

	// extract the values from the processed string to construct an actual working date object

	const [day, month, year] = dataCurrentAsOf.split(',')[0].split('.');

	/*

        Construct a new Date and out of the extracted values and the date string of the mostCurrentDataSet to be able to directly compare both dates by getting the day and comparing the date numbers

    */

	const newDate = new Date(year, month - 1, day).getDate();
	const oldDate = new Date(
		mostCurrentDataSet?.meta?.dataCurrentAsOf
	).getDate();

	if (newDate == oldDate) {
		return mostCurrentDataSet;
	}

	/**

        @description helper method to extract and process data from a provided node

        @param { htmlElement } node - the provided node which values should be parsed into a number

        @ returns { Number } the extracted number

    */

	const getValue = (node) => {
		const value = node.textContent.replace(',', '.').replace('%', '');
		return value.includes('.') ? parseFloat(value) : parseInt(value);
	};

	/*

		Extract the data from the dataNodes and parse them into numeric values

	*/

	const incidenceCurrentValue = getValue(dataNodes[3]);
	const hospitalizationCurrentValue = getValue(dataNodes[1]);
	const icuCurrentValue = getValue(dataNodes[13]);
	const vaccinationCurrentValue = getValue(dataNodes[27]);

	/*

		Gather the values from the last dataSet

	*/

	const incidenceLastValue = mostCurrentDataSet?.incidence?.value || 0;
	const hospitalizationLastValue =
		mostCurrentDataSet?.hospitalization?.value || 0;
	const icuLastValue = mostCurrentDataSet?.icuOccupancy?.value || 0;
	const vaccinationLastValue = mostCurrentDataSet?.vaccination?.value || 0;

	// construct and return a new DataSet

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

	history.push(newDataSet);

	return newDataSet;
};

/*

	@description method to update the data file

*/

const updateHistory = async ({ history }) => {
	const newHistory = { lastUpdated: Date.now(), history };

	try {
		await fs.writeFile(JSONPath, JSON.stringify(newHistory));
		return newHistory;
	} catch (e) {
		console.log(e);
	}
};

/*

	@description method to create a return object for the request

*/

const pruneHistoryToReturnObject = ({ timeframe, newHistory }) => {
	/*

		Parse the supposed length from string to integer and check if the parsing did not return undefined

	*/

	const supposedLength = parseInt(timeframe);

	if (supposedLength == undefined) {
		throw new Error(`${timeframe} is not of type number`);
	}

	// get the history array from the newHistory object

	const { history, lastUpdated } = newHistory;

	const newArray = history.slice(-supposedLength);

	return { lastUpdated, history: newArray };
};

/**

    @description - Method to crawl the provided Endpoint for the Incidence & Icu data and parse it into the schema. The method will also store and return the requested dataset.

    @param { {} } param1 - An Object passed to the method to control the returned data
    @param { String } param1.forceRefresh - A string representing a bool that will indicate if the timeToRefresh value should be ignored
    @param { String } param1.timeFrame - A string indicating how much of the history object should be retuned inside the data object. Defaults to 1 and will only return the last element
	@param { String } param1.requestHistory - A string representing a bool that will indicate if the complete history object should be returned after updating the data
    @param { Date } param1.timeStamp - The timestamp of the request.

    @returns { {} } an object containing the requested amount of history elements

*/

const fetchDataFromSource = async ({
	forceRefresh = 'false',
	timeframe = '1',
	requestHistory = 'false',
	requestTimestamp = Date.now(),
} = {}) => {
	/*

       	Retrieve the JSON File that holds the data and destructure the lastUpdated timestamp and history array from it. Gather the most current data set by accessing the last element of the array.

    */

	const File = await fs.readFile(JSONPath);
	const { lastUpdated, history } = JSON.parse(File);
	const mostCurrentDataSet = history[history.length - 1];

	/*

        Check if the mostCurrentDataSet is current enough. If either the forceRefresh bool is set or the dataSet is outdated, 

    */

	if (
		forceRefresh == 'false' ||
		requestTimestamp - timeToRefresh < lastUpdated
	) {
		return requestHistory == 'true'
			? pruneHistoryToReturnObject({
					timeframe,
					newHistory: { lastUpdated, history },
			  })
			: { lastUpdated, history: [mostCurrentDataSet] };
	}

	/*

        If the page needs to be recrawled, create a new Puppeteer instance

    */

	const browser = await puppeteer.launch({
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});
	const page = await browser.newPage();
	await page.goto(endpoint);

	/*

    	Retrieve the Body and parse it into queryable DOMNodes

    */

	const dataBody = await page.content();
	const [dataNodes, timeNodes] = ParseHTMLForNode(
		dataBody,
		'#wKennzahlen .blockelement tr > td',
		'#wKennzahlen .quellen p'
	);

	/*

		Close the browser instance

	*/

	await browser.close();

	/*

        Further process the data by extracting it from the crawled nodes and comparing it to the data that is currently in the history array. The method will also update the history array if the current data is outdated

    */

	extractDataFromNodes({
		dataNodes,
		timeNodes,
		history,
		mostCurrentDataSet,
	});

	/*

		update the history file

	*/

	const newHistory = await updateHistory({ history });

	/*

		If the complete history file is requesteed, return it

	*/

	if (requestHistory == 'true') {
		return pruneHistoryToReturnObject({ timeframe, newHistory });
	} else {
		return pruneHistoryToReturnObject({ timeframe: 1, newHistory });
	}
};

export { fetchDataFromSource };

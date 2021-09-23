/** @format */

/*

	This file and it's methods are used to handle the retrieval and storage of information relating to the different api endpoints

*/

// import dependencies

import { ParseHTMLForNode } from './htmlParser.mjs';
import { Cache } from './cache.mjs';
import { crawlSource } from './crawler.mjs';
import { accessDB } from '../config/mongo.config.mjs';
import { convertParsedData } from './converter.mjs';
import { Entry } from './entry.mjs';

// declare endpoints
const endpoint =
	'https://www.lgl.bayern.de/gesundheit/infektionsschutz/infektionskrankheiten_a_z/coronavirus/karte_coronavirus/index.htm';

/*

	Create a new cache for storing the data. The timeToExpire is set to 1 hour or 3600000ms

*/

const timeToExpire = 3600000;
// const timeToExpire = 100;

const cache = new Cache({ timeToExpire });

/*

	Two helper Methods to store and retrieve data from and into the DB.

*/

const getHistory = async () =>
	await accessDB('data', (col) => col.find().toArray());

/*

	Helper method to create a to day date object out of a string

*/

const parseDate = (string) => {
	const [day, month, year] = string.split(',')[0].split('.');

	return new Date(year, month - 1, day);
};

/*

	Method to check two dataSets for their equality

*/

const checkForEquality = async ({ dataSet }) => {
	// get the second to last entry

	const history = await getHistory();
	const currentEntry = history[history.length - 1];
	const lastEntry = history[history.length - 2] || {};

	if (!lastEntry?.meta?.created) {
	}

	for (const row in dataSet.data) {
		if (Object.hasOwnProperty.call(dataSet.data, row)) {
			let accessorString = `${row}__oldValue`;

			dataSet.data[accessorString] =
				lastEntry[row].value != null ? lastEntry[row].value : 0;
		}
	}

	const ent = new Entry(dataSet);

	// clear the meta entrys
	ent.meta = null;
	currentEntry.meta = null;

	// compare both sets and return true if their equal,  false if not

	return JSON.stringify(ent) === JSON.stringify(currentEntry) ? true : false;
};

/**

	@description method to process the dataSet into a entry object and return a up to date history array

	@param { {} } param1 - the object passed to the method containging a dataSet property

	@returns { [] } an array of all object currently saved in the db which make up the complete history of crawled data

*/

const processHistory = async ({ dataSet }) => {
	/*

		Get all entry's from the history and find the last entry. This should always be the entry inserted last into the db, and therefore the most current.

	*/

	const history = await getHistory();
	const lastEntry = history[history.length - 1] || {};

	// failsafe in case the last entry is undefined or is missing the created

	if (!lastEntry?.meta?.created) {
		try {
			// insert the object straight into the db

			const ent = new Entry(dataSet);

			await accessDB('data', (col) => col.insertOne(ent.export()));
		} catch (e) {
			console.log(e);
		}

		return await accessDB('data', (col) => col.find().toArray());
	}

	// parse the timestamps out of the dataSet

	const currentHospitalized = parseDate(dataSet.src.hospitalized);
	const currentIcu = parseDate(dataSet.src.icuOccupation);

	// the dataSet is updated only when both timestamps are outdated by at least one day

	const curHosDate = currentHospitalized.getDate();
	const curIcuDate = currentIcu.getDate();

	const lastHosDate = lastEntry.meta.currentAsOf.hospitalized.getDate();
	const lastIcuDate = lastEntry.meta.currentAsOf.icuOccupation.getDate();

	/*

		If both timestamps differ, a new entry should be pushed to the db. For that, a new entry is created and then pushed to the dataBase

	*/

	if (curHosDate > lastHosDate && curIcuDate > lastIcuDate) {
		for (const row in dataSet.data) {
			if (Object.hasOwnProperty.call(dataSet.data, row)) {
				let accessorString = `${row}__oldValue`;

				dataSet.data[accessorString] =
					lastEntry[row].value != null ? lastEntry[row].value : 0;
			}
		}

		try {
			const ent = new Entry(dataSet);

			await accessDB('data', (col) => col.insertOne(ent.export()));
		} catch (e) {
			console.log(e);
		}
	} else if (curHosDate == lastHosDate && curIcuDate == lastIcuDate) {
		/*
			
			If both dates are the same, check both sets for equality
		
		*/

		const equal = await checkForEquality({ dataSet });

		// if the dataSets are not equal, replace the last element in the db with a newly created DataSet

		if (!equal) {
			const ent = new Entry(dataSet);

			try {
				await accessDB('data', async (col) => {
					await col.replaceOne({ _id: lastEntry._id }, ent);
				});
			} catch (error) {
				if (error) throw new Error(error);
			}
		}
	}

	/*

		Return the most current history snapshot

	*/

	return await accessDB('data', (col) => col.find().toArray());
};

/**
 * 
	@description main method to retrive and parse the source for the requiered data via puppeteer

*/

const fetchDataFromSource = async ({ forceRefresh = false } = {}) => {
	/*

		Check if the cache is populated and if it is recent enough to not be updated or expired.

	*/

	const cachedData = cache.cachedData;
	const expired = cachedData != null ? cache.testForExpiration() : true;

	/*

		If the cache is not expired, return the cached data

	*/

	if (!expired && !forceRefresh) return await getHistory();

	/*

		Else, crawl the source for the data and initiate the parsing process

	*/

	try {
		const src = await crawlSource({ endpoint });
		const [data, sources] = await ParseHTMLForNode(
			src,
			'.block_overview tr > td',
			'.quellen p'
		);

		/*

			Pass the parsed data to the converter to insert it into the schema

		*/

		const dataSet = convertParsedData({ data, sources });
		// console.log(dataSet);

		/*

			Check if the currently chached data is equal to the data parsed. If it is, simply update the cache timestamp and return the history. 

			If the data is not equal, the data needs to be checked for differences and conditionally inserted into the db or update the DB post depending on the values changed

		*/

		if (cache.testForEquality(dataSet)) return await getHistory();

		// update the cache

		cache.update(dataSet);

		// process the dataSet and return it's result

		return await processHistory({ dataSet });
	} catch (error) {
		if (error) throw new Error(error);
		return { error };
	}
};

export { fetchDataFromSource };

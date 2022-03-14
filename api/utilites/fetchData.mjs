/** @format */

import { usePuppeteer } from '../../config/puppeteer.config.mjs';
import { workOrder } from './workOrder.mjs';
import { fetchHistory, insertHistory, Schema } from './dbController.mjs';
import { areDatesEqual } from './dateUtilities.mjs';

/**
 * Stores the current ms since utc-0. Will reset when the server restarts.
 * The number gets updated when a request is made. This is a very crude caching implementation.
 * A more robust solution might be necessary.
 * @type { number }
 */

let lastUpdated = 0;

/**
 * Constant drescribing the time after which the page will be crawled again.
 * @type { number }
 */

const TIMETOCACHE = 30 * 60 * 1000;

/**
 * The endpoint to crawl
 * @type { string }
 */

const ENDPOINT =
	'https://www.lgl.bayern.de/gesundheit/infektionsschutz/infektionskrankheiten_a_z/coronavirus/karte_coronavirus/index.htm';

/**
 * The time that needs to ellapse before a update to the db is forced.
 * @type { number }
 */

const FORCEUPDATEAFTER = 28 * 60 * 60 * 1000;

/**
 * Method to process the data and conform it to the api scheme. The method will also check if the current data set is
 * the most current one.
 *
 * @param { object } param0 - the object passed to the method
 * @param { object | null } param0.entry - the data created by the pageCrawler that needs to be conformed to the api
 * schema
 *
 * @returns { Promise<object[]> } - the complete history array
 */

export const processHistory = async ({ entry }) => {
	// Get the current history array from the db

	const currentHistory = await fetchHistory();

	// if entry is null, return the current history directly. Entry will only be null if a cache operation is executed

	if (entry === null) {
		return currentHistory;
	}

	// extract the last data set to compare against

	const lastDataSet = currentHistory[currentHistory.length - 1];

	// extract the data and src properties from the the passed entry and create a new Schema

	const { data, src } = entry;
	const parsedData = new Schema({ ...data, src });

	/**
	 * If the lastDataSet is undefined, push the parsedData to the db directly and return the just parsed dataSet as
	 * the only entry in the history array. This will only effect freshly instantiated dbs.
	 */

	if (!lastDataSet) {
		await insertHistory(parsedData);
		return [parsedData];
	}

	/**
	 *
	 * Due to the way the lgl updates its website, a series of checks need to be performed to deceide if the data
	 * present on the website (and with that, the data just crawled) is old or current.
	 *
	 * The two main data points (hospitalized & icu occupation) are updated independently of each other between 10am
	 * and 3pm. Being a non regular timeinterval, a time based solution to the problem appears to not be robust.
	 * There is an addinotal problem of icu occupation data apperantly being updated manually, with some days not
	 * receiving data updates all together, making updating the db on account of differing dates or data also not
	 * robust.
	 *
	 * The best approach is to update the db when both dates differ, and perform a manual check to see if the current
	 * dataset is more then 28 hours older then the last dataSet. If this is the case, a new entry is pushed to ensure
	 * that a daily entry exists.
	 *
	 * This approach is however prone to errors and will lag a possible update, but should at least ensure that there
	 * is a dataSet per day. Manual checks are still encouraged. It will also not take updated datasets into account.
	 *
	 */

	// check if the update should be forced. If so, force the update in the db and return the currentHistory + the parsedData

	const updateAfter = lastDataSet.meta.createdAt + FORCEUPDATEAFTER;
	if (updateAfter < parsedData.meta.createdAt) {
		await insertHistory(parsedData);
		return [...currentHistory, parsedData];
	}

	/**
	 * If both datasets are out of date, push the current dataSet to the db and return the history + parsedData.
	 */

	const hospitalizationIsCurrent = areDatesEqual(
		lastDataSet.meta.currentAsOf.hospitalized,
		parsedData.meta.currentAsOf.hospitalized
	);

	const icuOccupationIsCurrent = areDatesEqual(
		lastDataSet.meta.currentAsOf.icuOccupation,
		parsedData.meta.currentAsOf.icuOccupation
	);

	if (!hospitalizationIsCurrent && !icuOccupationIsCurrent) {
		await insertHistory(parsedData);
		return [...currentHistory, parsedData];
	}

	// if the data has not been updated, return the current history.

	return currentHistory;
};

/**
 *
 * The pageCrawler is the newest attempt to build a robust crawler, that can be easily configured to retrieve data
 * from the Website of the LGL after they deceide to update the layout again, breaking the whole api.
 *
 * @param { Object } param0 - the object psaseed to the the method containing the pupeteeer page to operate on and the
 * workOrder object containing the selectors and callbacks for the selectors.
 * @param { Page } param0.page - the puppeteer page to crawl
 * @param { {} } param0.workOrder - the workOrder for the crawler
 */

const pageCrawler = async ({ page, workOrder }) => {
	// get the categories from the workOrder object
	const { data, src } = workOrder;

	// initalize a empty object with the categoies to be filled

	const parsedData = {
		data: {},
		src: {},
	};

	const itterate = async (object, category) => {
		for (const name in object) {
			if (Object.hasOwnProperty.call(object, name)) {
				const order = object[name];

				try {
					const res = await page.$$eval(
						`${order.selector}`,
						order.callback
					);
					category[name] = res;
				} catch {
					/**
					 * In case an error happens on the itteration,
					 * null is returned. This will in turn have the api
					 * return the last valid data set, and prevent the
					 * server from crashing. Unfortunatley that also means,
					 * that their is no real way to indicate to the api call
					 * that an error occured during the call. For this, the
					 * architecture would need to be adapted.
					 */

					console.error(`Error itterating ${name}`);
					return null;
				}
			}
		}
	};

	await itterate(data, parsedData.data);
	await itterate(src, parsedData.src);

	if (!process.env.production) {
		console.log({ parsedData });
	}

	return parsedData;
};

const crawlSource = async ({ endpoint, shouldUpdate }) => {
	// If should update is false, the method returns early without creating a puppeteer instance.
	// This will hopefully cutting down on memory usage.

	if (!shouldUpdate) {
		if (!process.env.production) {
			console.log(`Cache current: Getting cached data.`);
		}

		return null;
	}

	if (!process.env.production) {
		console.log(`Cache elapsed: Getting new data.`);
	}

	// Set the last updated timeflag

	lastUpdated = Date.now();

	return await usePuppeteer(async ({ page }) => {
		await page.goto(endpoint);
		return await pageCrawler({ page, workOrder });
	});
};

/**
 *
 * @param { Object } param0 - the object passed to the method to confgiure the operations
 * @param { number } param0.timeFrame - a number indicating the amount of days of entries to be returned by the method.
 */

export const fetchData = async ({ timeFrame }) => {
	/**
	 * Check if it has been at least one hour since the last crawl to limit crawls.
	 */

	const now = Date.now();
	const shouldUpdate = now > lastUpdated + TIMETOCACHE;

	/**
	 * Fetch the data from the provided Endpoint using the crawlSource method, which will crawl the source and extract
	 * the needed data
	 */

	const data = await crawlSource({ endpoint: ENDPOINT, shouldUpdate });

	/**
	 * Process the data by creating a new history object if necessary and store/retrieve the most current version of
	 * the data existing, then returning the array pruned to the requested timeframe.
	 */

	const history = await processHistory({ entry: data });
	return history.slice(-timeFrame);
};

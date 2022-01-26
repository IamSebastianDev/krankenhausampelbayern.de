/** @format */

import Puppeteer from 'puppeteer';
import { workOrder } from './workOrder.mjs';
import { fetchHistory, insertHistory, Schema } from './dbController.mjs';
import { areDatesEqual } from './dateUtilities.mjs';

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
 * @param { object } param0.entry - the data created by the pageCrawler that needs to be conformed to the api schema
 *
 * @returns { Promise<object[]> } - the complete history array
 */

export const processHistory = async ({ entry }) => {
	// Get the current history array and extract the last dataSet from it

	const currentHistory = await fetchHistory();
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

				const res = await page.$$eval(
					`${order.selector}`,
					order.callback
				);

				category[name] = res;
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

const crawlSource = async ({ endpoint }) => {
	// create a new puppeteer instance

	const browser = await Puppeteer.launch({
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});

	// navigate to the endpoint and retrieve the data

	const page = await browser.newPage();
	await page.goto(endpoint);

	// get the page's content

	const data = await pageCrawler({ page, workOrder });

	// close the browser

	await browser.close();

	// return the data

	return data;
};

/**
 *
 * @param { Object } param0 - the object passed to the method to confgiure the operations
 * @param { number } param0.timeFrame - a number indicating the amount of days of entries to be returned by the method.
 */

export const fetchData = async ({ timeFrame }) => {
	/**
	 * Fetch the data from the provided Endpoint using the crawlSource method, which will crawl the source and extract
	 * the needed data
	 */

	const data = await crawlSource({ endpoint: ENDPOINT });

	/**
	 * Process the data by creating a new history object if necessary and store/retrieve the most current version of
	 * the data existing, then returning the array pruned to the requested timeframe.
	 */

	const history = await processHistory({ entry: data });
	return history.slice(-timeFrame);
};

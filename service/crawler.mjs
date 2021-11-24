/** @format */

/*

    This file contains the puppetteer crawler and it's configuration

*/

import Puppeteer from 'puppeteer';
import { pageCrawler, workOrder } from './pageCrawler.mjs';

/**

	@description method to crawl a provided endpoint for it's html content

	@param { {} } param1 - the object passed to the method containing the endpoint property
	@param { String } param1.endpoint - the endpoint to crawl, eg. a url 

	@returns { String } the string parsed from the webpage

*/

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

export { crawlSource };

/** @format */

import Puppeteer from 'puppeteer';

/**
 *
 * Method to execute a callback on a fresh puppeteer instance.
 *
 * @param { function } callback - the async callback passed to the method to execute. The method will receive an object
 * with the browser and page as properties to operate on.
 *
 * @returns { Promise<any | error> } the result of the callback or a error.
 */

export const usePuppeteer = async (callback) => {
	let result;
	let browser;

	try {
		// launch the browser and create a new page
		browser = await Puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
			defaultViewport: null,
		});
		const page = await browser.newPage();

		// execute the callback and set the result
		result = await callback({ browser, page });
	} catch (error) {
		result = error;
	}

	await browser.close();
	return result;
};

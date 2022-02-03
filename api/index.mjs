/** @format */

import { fetchData } from './utilites/fetchData.mjs';
import { adaptData } from 'c19api-adapternode';
import fs from 'fs/promises';

export const handleApiRequest = async (req, res) => {
	/**
	 * Get the query parameter from the request.query object and name them accordingly.
	 */

	const { timeframe: timeFrame, omitmetadata: omitMetaData } = req.query;
	let metaData = null;
	let jsonData;
	let history;
	let error = null;

	/**
	 * Fetch the data from the source according to the query parameters and return the result of the fetch.
	 * If the fetch fails, return the error instead.
	 */

	try {
		history = await fetchData({ timeFrame });
		jsonData = await fs.readFile('./api/metaData.json', 'utf-8');
	} catch (e) {
		error = e;
		console.log(e);
		res.sendStatus(500);
	}

	if (!omitMetaData) {
		const requestTimeStamp = Date.now();
		const numberOfDataSets = history.length;

		metaData = {
			...JSON.parse(jsonData),
			requestTimeStamp,
			numberOfDataSets,
		};
	}

	res.json({ history, metaData, error });
};

export const handleAdaptedRequest = async (req, res) => {
	/** @format */

	/**
	 * Get the query parameter from the request.query object and name them accordingly.
	 */

	const { timeframe: timeFrame, omitmetadata: omitMetaData } = req.query;
	let metaData = null;
	let jsonData;
	let history;
	let error = null;

	/**
	 * Fetch the data from the source according to the query parameters and return the result of the fetch.
	 * If the fetch fails, return the error instead.
	 */

	try {
		history = await fetchData({ timeFrame });
		jsonData = await fs.readFile('./api/metaData.json', 'utf-8');
	} catch (e) {
		error = e;
		console.log(e);
		res.sendStatus(500);
	}

	if (!omitMetaData) {
		const requestTimeStamp = Date.now();
		const numberOfDataSets = history.length;

		metaData = {
			...JSON.parse(jsonData),
			requestTimeStamp,
			numberOfDataSets,
		};
	}

	res.json(adaptData({ history, metaData, error }));
};

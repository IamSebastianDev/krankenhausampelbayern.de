/** @format */

/*

    Import the fetchDataFromSource method

*/

import { fetchDataFromSource } from '../service/crawlData.mjs';

const getData = async (req, res) => {
	/*

        fetch the data

    */

	const { forcerefresh, timeframe, requesthistory } = req.query;

	try {
		const sourceData = await fetchDataFromSource({
			forceRefresh: forcerefresh,
			timeframe,
			requestHistory: requesthistory,
			requestTimestamp: Date.now(),
		});

		/*

	        Return the data

	    */

		res.json(sourceData);
	} catch (e) {
		console.log(e);
		res.sendStatus(500).send(e);
	}
};

export { getData };

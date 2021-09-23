/** @format */

/*

    Import the fetchDataFromSource method

*/

import { fetchDataFromSource } from '../service/fetchData.mjs';

const getData = async (req, res) => {
	/*

        fetch the data

    */

	const { forcerefresh, timeframe } = req.query;

	try {
		const sourceData = await fetchDataFromSource({
			forceRefresh: forcerefresh,
			timeFrame: timeframe,
		});

		/*

			Prune the history to the desired timeframe

		*/

		const history = timeframe ? sourceData.slice(-timeframe) : sourceData;

		/*

	        Return the data

	    */

		res.json({
			timeStamp: Date.now(),
			numberOfDataSets: history.length,
			history,
		});
	} catch (e) {
		/*

			If an error occurs, log and return the error

		*/

		console.log(e);
		res.sendStatus(500).send(e);
	}
};

export { getData };

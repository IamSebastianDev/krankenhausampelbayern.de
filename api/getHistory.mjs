/** @format */

/*

    Import the fetchDataFromSource method

*/

import { fetchHistory } from '../service/fetchData.mjs';

const getHistory = async (req, res) => {
	/*

        fetch the data

    */

	const { timeframe } = req.query;

	try {
		const history = await fetchHistory({ timeframe });

		/*

	        Return the data

	    */

		res.json(history);
	} catch (e) {
		console.log(e);
		res.sendStatus(500).send(e);
	}
};

export { getHistory };

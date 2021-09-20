/** @format */

/*

    Import the fetchDataFromSource method

*/

import { fetchDataFromSource } from '../service/fetchData.mjs';

const getData = async (req, res) => {
	/*

        fetch the data

    */

	const { forcerefresh } = req.query;

	try {
		const sourceData = await fetchDataFromSource({
			forcerefresh,
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

/** @format */

const convertMeta = (meta) => {
	const { created, currentAsOf } = meta;
	return {
		created,
		currentAsOf: {
			icuOccupation: new Date(currentAsOf.icuOccupation),
			hospitalized: new Date(currentAsOf.hospitalized),
		},
	};
};

/**
 *
 *  A utility method to convert a dataSet in the history
 *
 * @param { {} } entry - the currently parsed entry
 * @param { {} } lastEntry - the previous entry
 * @param { number } index - the current index
 * @param { {} } metaData - the metaData returned by the api call that is used to extend the entry
 *
 * @returns { {} } the converted object
 */

const convertDataSet = (entry, lastEntry, index, metaData) => {
	const convertedEntry = { index, meta: convertMeta(entry.meta) };

	delete entry._id;
	delete entry.meta;

	for (const dataPoint in entry) {
		if (Object.hasOwnProperty.call(entry, dataPoint)) {
			const data = entry[dataPoint];

			convertedEntry[
				dataPoint === 'vaccinated' ? 'vaccination' : dataPoint
			] = {
				title: metaData[dataPoint].title,
				description: metaData[dataPoint].description,
				threshold: metaData[dataPoint].threshold,
				unit: metaData[dataPoint].unit,
				value: data,
				cases: data,
				lastValue: lastEntry ? lastEntry[dataPoint] : 0,
			};
		}
	}

	return convertedEntry;
};

/**
 * The adapter function is used to adapt the data returned by the V2Api back to the Schema the V1 API.
 *
 * @param { {} } data - the data object returned by the API. The object needs to containg the history and metaData
 * @returns { {} } containing the history array property, the timeStamp and the number of DataSets returned. The
 * raw property also contains the data passed to the function
 */

export const adaptData = (data) => {
	const { history, metaData } = data;

	/**
	 * If the extracted metaData does not exist, or the history object has only one entrance, the data cannot be
	 * parsed. Throw an error and notify the user
	 */

	if (history.length <= 1 || metaData === null) {
		throw new Error(
			`C19ApiV2-AdapterNode: Parsing data requires a dataSet containing metaData and a history object with a length longer then 1. Check your API response for errors.`
		);
	}

	/**
	 * Parse the provided history array into an array containing the daily data. This enables the consumer to use the
	 * history entries indepenendently. It also converts the slimmer v2 api into the v1 api.
	 */

	const parsedData = history.map((entry, index) =>
		convertDataSet(entry, history[index - 1], index, metaData)
	);

	return {
		timeStamp: metaData.requestTimeStamp,
		numberOfDataSets: metaData.numberOfDataSets,
		history: parsedData,
		raw: data,
	};
};

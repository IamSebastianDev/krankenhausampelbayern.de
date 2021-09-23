/** @format */

/*

    This file contains the converter method, that converts the raw parsed data into the sorted object

*/

/*

    The indices map object holds the indexes used to find data inside the crawled dom object. 

*/

const indicesMap = {
	data: {
		hospitalized: 17,
		hospitalized7Days: 1,
		hospitalizedIncidence: 3,
		deaths7Days: 11,
		icuOccupation: 13,
		cases7Days: 21,
		incidence7Days: 23,
		rvalue: 32,
		vaccination: 33,
	},
	sources: {
		hospitalized: 0,
		icuOccupation: 2,
	},
};

/**

    @description helper method to extract the date value from the provided string.
    @todo: Refractror the regex into a constant

    @param { String } string - the string passed to the function containing the date value

    @returns { String } the numerical string representing date and time

*/

const extractDatefromString = (string) =>
	string
		.match(/Stand[0-9., :]*Uhr/gim)[0]
		.replace('Stand:', '')
		.replace('Uhr', '')
		.trim();

/**

    @description method to convert the data parsed from the sources body into a key value pair object.

    @param { {} } param1 - the object passed to the method containing the data and source properties
    @param { {} } param1.data - the nodes containg the data values
    @param { {} } param1.sources - the nodes containg the sources and their respective update time

    @returns { {} } the object containing the extracted values associated with their identifier

*/

const convertParsedData = ({ data, sources }) => {
	// initate the dataSet return object

	const dataSet = { src: {}, data: {} };

	// iterate over the provided indicies map and extract the textContent based on the indicies value

	for (const row in indicesMap.data) {
		if (Object.hasOwnProperty.call(indicesMap.data, row)) {
			const value = indicesMap.data[row];

			dataSet.data[row] = data[value].textContent;
		}
	}

	for (const row in indicesMap.sources) {
		if (Object.hasOwnProperty.call(indicesMap.sources, row)) {
			const value = indicesMap.sources[row];

			dataSet.src[row] = extractDatefromString(
				sources[value].textContent
			);
		}
	}

	return dataSet;
};

// export the converter method

export { convertParsedData };

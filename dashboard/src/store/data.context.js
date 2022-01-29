/** @format */

import React, { useState, useEffect, createContext } from 'react';
import { useData } from '../hooks/useData.hook';
import { theme } from '../scripts/theme.util.js';

export const DataCtx = createContext();

export const DataContext = ({ children }) => {
	// get the data, current entry and eventual error from the api
	const { data, currentEntry, error } = useData();

	const [dataForWidgets, setDataForWidgets] = useState();
	useEffect(() => {
		if (!currentEntry) {
			return;
		}

		let convertedData = {};

		for (const key in currentEntry) {
			if (Object.hasOwnProperty.call(currentEntry, key)) {
				const data = currentEntry[key];

				// check if the current property is neither the index nor the meta property
				// as both properties receive no widget.

				if (key !== 'index' && key !== 'meta') {
					// construct the the new object with the data, name and theme of the widget attached.

					convertedData[key] = {
						...data,
						name: key,
						theme: theme[
							key !== 'vaccinated' ? 'inverted' : 'normal'
						],
					};
				}
			}
		}

		setDataForWidgets(convertedData);
	}, [currentEntry]);

	return (
		<DataCtx.Provider value={{ data, currentEntry, dataForWidgets, error }}>
			{children}
		</DataCtx.Provider>
	);
};

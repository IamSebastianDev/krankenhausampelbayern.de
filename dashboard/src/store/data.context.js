/** @format */

import React, { createContext } from 'react';
import { useData } from '../hooks/useData.hook';

export const DataCtx = createContext();

export const DataContext = ({ children }) => {
	const { data, currentEntry } = useData();

	return (
		<DataCtx.Provider value={{ data, currentEntry }}>
			{children}
		</DataCtx.Provider>
	);
};

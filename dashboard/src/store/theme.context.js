/** @format */

import React, { createContext } from 'react';
import { useColourTheme } from '../hooks/useColourTheme.hook';

export const ThemeCtx = createContext();

export const ThemeContext = ({ children }) => {
	const [theme, setTheme, systemDefault] = useColourTheme({
		target: document.querySelector('body'),
	});

	return (
		<ThemeCtx.Provider value={{ theme, setTheme, systemDefault }}>
			{children}
		</ThemeCtx.Provider>
	);
};

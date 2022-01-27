/** @format */

import React, { useState, useEffect } from 'react';
import { usePrefersColourScheme } from './usePrefersColourScheme.hook';

const storageIdentifier = 'user-colour-theme';

export const useColourTheme = ({ target }) => {
	const storedTheme = localStorage.getItem(storageIdentifier);

	const systemTheme = usePrefersColourScheme();
	const [systemDefault, setSystemDefault] = useState(
		storedTheme ? true : false
	);
	const [theme, setTheme] = useState(storedTheme);

	const changeTheme = (theme) => {
		switch (theme) {
			case 'system':
				localStorage.removeItem(storageIdentifier);
				setTheme(systemTheme);
				setSystemDefault(true);
				break;
			default:
				localStorage.setItem(storageIdentifier, theme);
				setTheme(theme);
				setSystemDefault(false);
				break;
		}
	};

	useEffect(() => {
		if (!theme) {
			setTheme(systemTheme);
		}

		target.classList.toggle('dark', theme === 'dark');
	});

	return [theme, changeTheme, systemDefault];
};

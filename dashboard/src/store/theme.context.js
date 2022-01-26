/** @format */

import React, { createContext, useState, useEffect } from 'react';
import { usePrefersColourScheme } from '../hooks/usePrefersColourScheme.hook';

export const ThemeCtx = createContext();

/**
 *
 * @todo: clean this up!
 * @todo: rewrite theme switcher internals
 * @todo: fix userPrefersColourScheme choice
 *
 */

export const ThemeContext = ({ children }) => {
	const userPrefersColourScheme = usePrefersColourScheme();
	const [theme, setTheme] = useState(
		localStorage.getItem('userColourScheme') || userPrefersColourScheme
	);

	const changeTheme = (theme) => {
		if (theme === 'system') {
			localStorage.removeItem('userColourScheme');
			setTheme('system');
			return;
		}

		localStorage.setItem('userColourScheme', theme);
		setTheme(theme);
	};

	useEffect(() => {
		if (
			userPrefersColourScheme &&
			!localStorage.getItem('userColourScheme')
		) {
			localStorage.setItem('userColourScheme', userPrefersColourScheme);
		}
	}, [userPrefersColourScheme, theme]);

	useEffect(() => {
		if (theme === 'system') {
			document
				.querySelector('body')
				.classList.toggle('dark', userPrefersColourScheme === 'dark');
			return;
		}

		theme === 'dark'
			? document.querySelector('body').classList.add('dark')
			: document.querySelector('body').classList.remove('dark');
	}, [theme]);

	return (
		<ThemeCtx.Provider value={{ theme, changeTheme }}>
			{children}
		</ThemeCtx.Provider>
	);
};

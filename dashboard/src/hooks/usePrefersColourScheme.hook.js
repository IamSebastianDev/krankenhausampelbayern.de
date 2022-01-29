/** @format */

import { useEffect, useState } from 'react';

export const usePrefersColourScheme = () => {
	const [colourScheme, setColourScheme] = useState();

	const queryChangeHandler = (ev) => {
		setColourScheme(ev.target.matches ? 'dark' : 'light');
	};

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		if (mediaQuery) {
			setColourScheme(mediaQuery.matches ? 'dark' : 'light');
			mediaQuery.addEventListener('change', queryChangeHandler);
		}

		return () =>
			mediaQuery.removeEventListener('change', queryChangeHandler);
	}, []);

	return colourScheme;
};

/** @format */

import React, { useEffect, useState } from 'react';

export const useReducedMotion = (defaultValue = true) => {
	const [reduceMotion, setReduceMotion] = useState(defaultValue);

	const queryChangeHandler = (ev) => {
		setReduceMotion(ev.target.matches);
	};

	useEffect(() => {
		const mediaQuery = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		);

		if (mediaQuery) {
			setReduceMotion(mediaQuery.matches);
			mediaQuery.addEventListener('change', queryChangeHandler);
		}

		return () =>
			mediaQuery.removeEventListener('change', queryChangeHandler);
	}, []);

	return reduceMotion;
};

/** @format */

import { useState, useEffect, useCallback } from 'react';
import { adaptData } from 'c19api-adapternode';

export const useData = () => {
	const [data, setData] = useState();
	const [error, setError] = useState();

	const fetchData = useCallback(async () => {
		const res = await fetch('/api');
		const parsed = await res.json();
		console.log({ parsed });

		if (parsed.error) {
			setError(parsed.setError);
			return;
		}

		setData(adaptData(parsed));
	}, []);

	useEffect(() => {
		if (!data) {
			try {
				fetchData();
			} catch (e) {
				setError(e);
			}
		}
	}, [data, fetchData]);

	const currentEntry = data ? data.history[data.history.length - 1] : null;

	return { data, currentEntry, error };
};

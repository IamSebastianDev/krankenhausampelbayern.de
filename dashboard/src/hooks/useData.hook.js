/** @format */

import React, { useState, useEffect, useCallback } from 'react';
import { adaptData } from 'c19api-adapternode';

export const useData = () => {
	const [data, setData] = useState();

	const fetchData = useCallback(async () => {
		const res = await fetch('/api');
		setData(adaptData(await res.json()));
	}, []);

	useEffect(() => {
		if (!data) {
			fetchData();
		}
	}, [data, fetchData]);

	const currentEntry = data ? data.history[data.history.length - 1] : null;

	return { data, currentEntry };
};

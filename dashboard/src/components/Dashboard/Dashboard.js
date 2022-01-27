/** @format */

import React, { useContext } from 'react';
import { DataCtx } from '../../store/data.context';

import { Section } from '../UI/Section';
import { Loader } from '../UI/Loader';
import { Card } from '../UI/Card';

export const Dashboard = () => {
	const { data, currentEntry } = useContext(DataCtx);
	const loading = data === undefined;
	console.log({ data, currentEntry });

	return (
		<Section id="dashboard">
			<Loader loading={loading} />
			{data && (
				<div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 py-20 max-w-screen-xl m-4 xl:mx-auto p-4 border border-blue-500"></div>
			)}
		</Section>
	);
};

/** @format */

import React, { useContext, useEffect, useState } from 'react';
import { DataCtx } from '../../store/data.context';

import { Section } from '../UI/Section';
import { Loader } from '../UI/Loader';

import { Widget } from './Widgets/Widget';

export const Dashboard = () => {
	const [widgetData, setWidgetData] = useState();
	const { data, currentEntry } = useContext(DataCtx);
	const loading = widgetData === undefined;

	const theme = {
		positive: {
			positive: 'dark:text-blue-500 text-blue-600',
			neutral: 'dark:text-inherit text-slate-700',
			negative: 'dark:text-red-500 text-red-600',
		},
		negative: {
			positive: 'dark:text-red-500 text-red-600',
			neutral: 'dark:text-inherit text-slate-700',
			negative: 'dark:text-blue-500 text-blue-600',
		},
	};

	useEffect(() => {
		if (currentEntry) {
			const convertData = Object.entries(currentEntry)
				.filter(([name, data]) => name !== 'index' && name !== 'meta')
				.map(([name, data]) => ({
					...data,
					theme: theme[
						name !== 'vaccinated' ? 'negative' : 'positive'
					],
				}));
			setWidgetData(convertData);
		}
	}, [currentEntry]);
	console.log({ widgetData });

	return (
		<Section id="dashboard" className="flex flex-col">
			<Loader loading={loading} id="main-loader" />
			{widgetData && (
				<div className="mx-auto max-w-xs md:max-w-screen-md lg:max-w-screen-lg w-full my-auto">
					<div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3  my-4 mx-3 md:mx-16 lg:mx-4  gap-6 dark:text-zinc-100 text-zinc-700">
						{widgetData.map((data, index) => (
							<Widget data={data} key={index} />
						))}
					</div>
				</div>
			)}
		</Section>
	);
};

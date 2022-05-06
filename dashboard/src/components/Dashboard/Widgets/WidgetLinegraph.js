/** @format */
import React, { useContext, useMemo } from 'react';
import { ThemeCtx } from '../../../store/theme.context';
import { ResponsiveLine } from '@nivo/line';
import { Card } from '../../UI/Card';
import { WidgetTitle } from './WidgetTitle';

export const WidgetLinegraph = ({ history }) => {
	const timeframe = history.length;
	const data = useMemo(
		() => [
			{
				id: 'Intensivbelegung',
				color: 'rgb(37, 99, 235)',
				data: history.map(({ meta, icuOccupation }) => {
					return {
						x: new Date(meta.currentAsOf.icuOccupation),
						y: icuOccupation.value,
					};
				}),
			},
			{
				id: 'Hospitalisierung',
				color: 'rgb(239, 68, 68)',
				data: history.map(({ meta, hospitalized7Days }) => {
					return {
						x: new Date(meta.currentAsOf.hospitalized),
						y: hospitalized7Days.value,
					};
				}),
			},
		],
		history
	);

	const { theme } = useContext(ThemeCtx);
	const themes = {
		dark: {
			textColor: 'rgb(244, 244, 245)',
			grid: {
				line: {
					stroke: 'rgb(63, 63, 70)',
				},
			},
			tooltip: {
				container: {
					background: 'rgb(63, 63, 70)',
				},
			},
		},
		light: {
			textColor: 'rgb(63, 63, 70)',
			grid: {
				line: {
					stroke: 'rgb(212, 212, 216)',
				},
			},
			tooltip: {
				container: {
					background: 'rgb(212, 212, 216)',
				},
			},
		},
	};

	return (
		<Card className="group relative hidden min-h-[300px] w-full flex-col justify-between font-nunito font-bold md:col-span-2 md:flex">
			<WidgetTitle
				title={`Krankenhausauslastung der letzten ${timeframe} Tage.`}
				description={`Anzahl der Patienten die mit Covid-19 Hospitalisiert & auf der Intensivstation liegen im ${timeframe} Tages Verlauf.`}
			/>
			<div className="mt-auto flex h-full flex-row items-center justify-between">
				<ResponsiveLine
					theme={themes[theme]}
					margin={{ bottom: 24, left: 35, top: 10, right: 20 }}
					data={data}
					colors={data.map(({ color }) => color)}
					colorBy="index"
					legends={[
						{
							anchor: 'bottom-right',
							direction: 'row',
							itemWidth: 120,
							itemHeight: 25,
						},
					]}
					xScale={{
						type: 'time',
						format: '%d/%m/%Y',
						precision: 'day',
					}}
					xFormat="time:%Y-%m-%d"
					yScale={{
						type: 'linear',
					}}
					axisLeft={{
						legend: 'Fälle',
						legendOffset: 10,
					}}
					axisBottom={{
						format: '%b %d',
						tickValues: 'every 28 days',
					}}
					enablePoints={false}
					useMesh={true}
				/>
			</div>
		</Card>
	);
};

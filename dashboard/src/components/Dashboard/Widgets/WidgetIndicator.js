/** @format */

import { joinClassNames as cls } from '../../../scripts/joinClassNames.util';

import { ArrowRight } from 'react-pangolicons';

import { Card } from '../../UI/Card';
import { WidgetTitle } from './WidgetTitle';

export const WidgetIndicator = ({ data }) => {
	/**
	 * To calculate the current stage of the trafficlight, we check the second to last day of the data set, as changes
	 * will only come into effect the day after the threshold is passed. To calculate the stage, the following rules
	 * are applied to check the values against the thresholds:
	 *  - icuOccupation > threshold of 600 -> Red (2)
	 * 	- icuOccupation > threshold of 450 || hospitalized7Days > threshold of 1200 -> Yellow (1)
	 * 	- icuOccupation < 450 && hospitalized7Days < 1200 -> Green (0)
	 */

	const source = data.history[data.numberOfDataSets - 2];
	const getStage = ({ source }) => {
		const { icuOccupation, hospitalized7Days } = source;

		if (icuOccupation.value > icuOccupation.threshold) {
			return 2;
		} else if (
			icuOccupation.value > 450 ||
			hospitalized7Days.value > hospitalized7Days.threshold
		) {
			return 1;
		}

		return 0;
	};

	const stages = [
		{
			color: 'bg-green-500 shadow-green-500',
			message: 'Grün.',
		},
		{
			color: 'bg-yellow-300 shadow-yellow-300',
			message: 'Gelb.',
		},
		{
			color: 'bg-red-500 shadow-red-500',
			message: 'Rot.',
		},
	];

	const currentStage = getStage({ source });

	return (
		<Card className="relative flex flex-col justify-between font-nunito font-bold max-w-sm min-h-[300px] group">
			<WidgetTitle
				title="Krankenhaus-Ampel Bayern"
				description="Die Krankenhaus-Ampel gibt Auskunft über die momentane Auslastung des bayrischen Gesundheitssystem."
			/>
			<div className="flex flex-row h-32 mt-auto mb-2 justify-between items-center">
				<span
					className={cls(
						'shrink-0 mx-2 w-20 h-20 rounded-full shadow-tl border-4 dark:border-[6px] dark:border-zinc-900 border-zinc-200',
						stages[currentStage].color
					)}
				/>
				<div className="ml-3 leading-tight">
					<p>
						Die bayrische Krankenhaus-Ampel steht zur Zeit auf{' '}
						{stages[currentStage].message}
					</p>
				</div>
			</div>
			<div className="flex flex-row justify-between items-center text-sm font-bold font-nunito tracking-wider">
				<a
					href="https://www.stmgp.bayern.de/coronavirus/#kh-ampel"
					target="_blank"
					rel="noreferrer noopener"
					className="flex flex-row justify-center items-center underline">
					<ArrowRight size={12} className="mr-2" /> Aktuell
					geltendende Regelungen
				</a>
			</div>
		</Card>
	);
};

/** @format */

import { joinClassNames as cls } from '../../../scripts/joinClassNames.util';

const calcDifference = (cur, last, unit) => {
	let dif = cur - last;
	return [
		dif < 0 ? '' : '+',
		Number.isInteger(dif) ? dif : dif.toFixed(2),
		unit === null || unit === 'Fälle' ? '' : unit,
	];
};

const calcPercentage = (val, threshold) => ((100 * val) / threshold).toFixed(2);

export const WidgetDetails = ({ value, lastValue, threshold, unit, theme }) => {
	const percentage = calcPercentage(value, threshold);
	const difference = calcDifference(value, lastValue, unit);

	return (
		<div className="flex flex-row justify-between items-center text-sm font-bold font-nunito tracking-wider">
			<span
				className={cls(
					percentage > 100 ? theme.positive : theme.neutral
				)}>
				{threshold && value + ' / ' + threshold}
			</span>
			<span
				className={cls(
					percentage > 100 ? theme.positive : theme.negative
				)}>
				{threshold && `(${percentage}%)`}
			</span>
			<span
				className={cls(
					value - lastValue > 0 ? theme.positive : theme.negative
				)}>
				{difference.join('')}
			</span>
		</div>
	);
};

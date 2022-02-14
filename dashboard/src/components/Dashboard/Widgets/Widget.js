/** @format */

import { Card } from '../../UI/Card';
import { ArrowRightUp, ArrowRightDown, ArrowRight, X } from 'react-pangolicons';
import { WidgetTitle } from './WidgetTitle';
import { WidgetDetails } from './WidgetDetails';

import { joinClassNames as cls } from '../../../scripts/joinClassNames.util';
import { textSizes } from '../../../scripts/textsizes.util.js';

const calcTrend = (cur, last) => (cur !== last ? (cur < last ? 0 : 2) : 1);

export const Widget = ({ data, onClick }) => {
	const trend = calcTrend(data.value, data.lastValue);
	const [value, decimal] = data.value.toString().split('.');

	const colours = [
		data.theme.negative,
		data.theme.neutral,
		data.theme.positive,
	];
	const attrs = { size: 64, strokeWidth: 3, className: colours[trend] };
	const icons = [
		<ArrowRightDown {...attrs} />,
		<ArrowRight {...attrs} />,
		<ArrowRightUp {...attrs} />,
	];

	return (
		<Card className="font-nunito group relative flex aspect-square min-h-[300px] max-w-sm flex-col justify-between text-left font-bold">
			{onClick && (
				<button
					onClick={() =>
						onClick({ type: 'delete', payload: data.name })
					}
					className="absolute top-0 right-0 rounded-tr-2xl rounded-bl-2xl p-4 hover:bg-red-500 hover:text-white hover:shadow-md group-hover:visible md:invisible">
					<X size={16} strokeWidth={3} />
				</button>
			)}
			<WidgetTitle title={data.title} description={data.description} />
			<div className="mt-auto mb-2 flex h-32 flex-row items-center justify-between pl-4">
				<span className="mr-4 shrink-0">{icons[trend]}</span>
				<div>
					<span
						className={cls(
							textSizes[value.length],
							data.threshold
								? data.value < data.threshold
									? data.theme.negative
									: data.theme.positive
								: data.theme.neutral
						)}>
						{value}
					</span>
					{decimal && (
						<span className="px-1 text-lg">.{decimal}</span>
					)}
				</div>
			</div>
			<WidgetDetails {...data} />
		</Card>
	);
};

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
		<Card className="relative flex flex-col justify-between font-nunito font-bold max-w-sm min-h-[300px] group aspect-square text-left">
			{onClick && (
				<button
					onClick={() =>
						onClick({ type: 'delete', payload: data.name })
					}
					className="absolute top-0 right-0 p-4 md:invisible group-hover:visible hover:bg-red-500 hover:text-white hover:shadow-md rounded-tr-2xl rounded-bl-2xl">
					<X size={16} strokeWidth={3} />
				</button>
			)}
			<WidgetTitle title={data.title} description={data.description} />
			<div className="flex flex-row h-32 pl-4 mt-auto mb-2 justify-between items-center">
				<span className="shrink-0 mr-4">{icons[trend]}</span>
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
						<span className="text-lg px-1">.{decimal}</span>
					)}
				</div>
			</div>
			<WidgetDetails {...data} />
		</Card>
	);
};

/** @format */

import { useState, useEffect, useContext, useReducer } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion.hook';
import { DataCtx } from '../../../store/data.context';

import { Widget } from './Widget';
import { X, ChevronLeft, ChevronRight } from 'react-pangolicons';

import { joinClassNames as cls } from '../../../scripts/joinClassNames.util';

export const WidgetModal = ({
	isVisible,
	toggleModal,
	dispatchLayout,
	layout,
}) => {
	const reduceMotion = useReducedMotion();
	const { dataForWidgets } = useContext(DataCtx);
	// derive the remaining widgets from the current layout
	const [remainingWidgets, setRemainingWidgets] = useState();
	const [currentWidget, setCurrentWidget] = useState();
	const [index, setIndex] = useState(0);

	const nextWidget = () => {
		setIndex((i) => (i + 1 >= remainingWidgets.length ? 0 : i + 1));
	};

	const lastWidget = () => {
		setIndex((i) => (i - 1 < 0 ? remainingWidgets.length - 1 : i - 1));
	};

	useEffect(() => {
		if (!dataForWidgets) return;
		setRemainingWidgets(
			Object.keys(dataForWidgets).filter((name) => !layout.includes(name))
		);
	}, [dataForWidgets, layout]);

	useEffect(() => {
		if (!dataForWidgets || !remainingWidgets) return;
		setCurrentWidget(dataForWidgets[remainingWidgets[index]]);
	}, [dataForWidgets, remainingWidgets, index]);

	const handleAddWidget = () => {
		dispatchLayout({
			type: 'add',
			payload: currentWidget.name,
		});
		toggleModal();
	};

	return (
		<section
			id="widget-modal"
			className={cls(
				'fixed top-0 left-0 h-screen w-screen dark:bg-zinc-900 dark:bg-opacity-50 bg-zinc-100 bg-opacity-50 z-20 transform transition-transopaque duration-300 backdrop-blur dark:backdrop-blur-md shadow-md text-zinc-700 dark:text-zinc-300',
				isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0',
				reduceMotion ? '' : 'transition-transopaque duration-100'
			)}>
			<button
				className="absolute top-0 right-0 mt-20 mr-4"
				onClick={toggleModal}>
				<X />
			</button>
			<div className="flex flex-row justify-between items-center w-full h-full max-w-screen-lg mx-auto">
				<button className="p-4" onClick={lastWidget}>
					<ChevronLeft size={32} />
				</button>
				{currentWidget && (
					<div className="grid grid-cols-1 place-items-center transform scale-75 sm:scale-100 font-semibold font-nunito dark:text-zinc-200 text-zinc-800">
						<h3 className="text-3xl py-5">{currentWidget.title}</h3>

						<button
							className="border-4 rounded-2xl border-transparent hover:border-blue-500"
							onClick={handleAddWidget}>
							<Widget data={currentWidget} />
						</button>
						<span className="py-5 text-lg">
							Klicke das Widget an, um es zu deinem Dashboard
							hinzuzufügen.
						</span>
					</div>
				)}
				{remainingWidgets && remainingWidgets.length === 0 && (
					<h3 className="text-xl md:text-3xl text-center">
						Keine weiteren Widgets zum hinzufügen vorhanden.
					</h3>
				)}
				<button className="p-4" onClick={nextWidget}>
					<ChevronRight size={32} />
				</button>
			</div>
		</section>
	);
};

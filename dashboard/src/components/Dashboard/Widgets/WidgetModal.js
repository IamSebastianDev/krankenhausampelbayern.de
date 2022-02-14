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
				'transition-transopaque fixed top-0 left-0 z-20 h-screen w-screen transform bg-zinc-100 bg-opacity-50 text-zinc-700 shadow-md backdrop-blur duration-300 dark:bg-zinc-900 dark:bg-opacity-50 dark:text-zinc-300 dark:backdrop-blur-md',
				isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
				reduceMotion ? '' : 'transition-transopaque duration-150'
			)}>
			<button
				className="absolute top-0 right-0 mt-20 mr-4"
				onClick={toggleModal}>
				<X />
			</button>
			<div className="mx-auto flex h-full w-full max-w-screen-lg flex-row items-center justify-between">
				<button className="p-4" onClick={lastWidget}>
					<ChevronLeft size={32} />
				</button>
				{currentWidget && (
					<div className="font-nunito grid scale-75 transform grid-cols-1 place-items-center font-semibold text-zinc-800 dark:text-zinc-200 sm:scale-100">
						<h3 className="py-5 text-3xl">{currentWidget.title}</h3>

						<button
							className="rounded-2xl border-4 border-transparent hover:border-blue-500"
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
					<h3 className="text-center text-xl md:text-3xl">
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

/** @format */

import { useContext, useState, useReducer } from 'react';
import { DataCtx } from '../../store/data.context';
import { useScrollLock } from '../../hooks/useScrollLock.hook';
import { ExternalLink } from '../Navigation/ExternalLink';

import { Section } from '../UI/Section';
import { Loader } from '../UI/Loader';

import { Plus, X, InfoCircle } from 'react-pangolicons';

import { Widget } from './Widgets/Widget';
import { WidgetIndicator } from './Widgets/WidgetIndicator';
import { WidgetLinegraph } from './Widgets/WidgetLinegraph';
import { WidgetModal } from './Widgets/WidgetModal';
import { Messages } from './Messages';

// The notice currently displayed by the LGL. This is a static message instead of a dynamically created error message

const notice = (
	<>
		<strong>Bitte beachten Sie:</strong> Aufgrund der sehr hohen Fallzahlen
		im Zuge der Omikron-Welle und der damit einhergehenden Überlastung der
		Gesundheitsämter ist derzeit von einem aktuell stärkeren Meldeverzug bei
		den Meldezahlen sowie größeren Schwankungen aufgrund vermehrter
		nachträglicher Datenkorrekturen auszugehen. Allgemein ist zu beachten,
		dass in Zeiten erhöhten Fallaufkommens sowohl eine höhere Dunkelziffer
		als auch ein größerer Meldeverzug anzunehmen ist.{' '}
		<a
			className="font-bold underline"
			href="https://www.lgl.bayern.de/gesundheit/infektionsschutz/infektionskrankheiten_a_z/coronavirus/karte_coronavirus/index.htm#hinweis_fallzahlen"
			rel="noreferrer noopener"
			target="_blank">
			Mehr erfahren.
		</a>
	</>
);

// the theme colours for the different widget types

export const Dashboard = () => {
	const [setScrollLock] = useScrollLock();
	const [showWidgetLister, setShowWidgetLister] = useState(false);

	const { data, currentEntry, dataForWidgets, error } = useContext(DataCtx);
	const numberOfWidgets =
		dataForWidgets && Object.keys(dataForWidgets).length;
	const loading = dataForWidgets === undefined;

	/**
	 * The layout of the data widgets
	 */

	const defaultLayout = [
		'hospitalizedIncidence',
		'hospitalized7Days',
		'icuOccupation',
	];
	const userLayout = JSON.parse(localStorage.getItem('layout'));

	const layoutReducer = (layout, { type, payload }) => {
		let newLayout;

		switch (type) {
			case 'delete':
				newLayout = layout.filter((name) => name !== payload);
				break;
			case 'add':
				newLayout = [...layout, payload];
				break;
			default:
				throw new Error(`"${type}" not recognized in: layoutReducer()`);
		}

		window.localStorage.setItem('layout', JSON.stringify(newLayout));
		return newLayout;
	};

	const [layout, dispatchLayout] = useReducer(
		layoutReducer,
		userLayout || defaultLayout
	);

	const toggleWidgetModal = () => {
		setShowWidgetLister((s) => !s);
		setScrollLock((s) => !s);
	};

	return (
		<Section id="dashboard" className="flex flex-col">
			<Loader loading={loading} id="main-loader" />
			{!loading && (
				<>
					<Messages messages={[notice, error]} />
					<WidgetModal
						layout={layout}
						dispatchLayout={dispatchLayout}
						isVisible={showWidgetLister}
						toggleModal={toggleWidgetModal}
					/>
					<div className="mx-auto w-full max-w-sm md:max-w-screen-md lg:max-w-screen-lg">
						<div className=" my-4 mx-6 grid auto-rows-fr grid-cols-1  gap-6 text-zinc-700 dark:text-zinc-100 md:mx-16 md:grid-flow-row-dense md:grid-cols-2 lg:mx-4 lg:grid-cols-3">
							<WidgetIndicator data={data} />
							<WidgetLinegraph history={data.history} />
							{layout.map(
								(name, index) =>
									dataForWidgets[name] && (
										<Widget
											data={dataForWidgets[name]}
											key={index}
											onClick={dispatchLayout}
										/>
									)
							)}
							{layout.length < numberOfWidgets && (
								<button
									onClick={toggleWidgetModal}
									className="m-20 grid place-items-center rounded-2xl border border-zinc-400 text-zinc-400 hover:border-zinc-800 hover:text-zinc-800 dark:border-zinc-600 dark:hover:border-zinc-200 dark:hover:text-zinc-200 ">
									<Plus size={72} strokeWidth={2} />
								</button>
							)}
						</div>
					</div>
					<div
						id="sources"
						className="relative my-8 mx-6 flex flex-col items-center justify-center border border-blue-500 py-6 px-4 text-center text-sm text-zinc-500 dark:text-zinc-500 sm:mx-auto sm:flex-row sm:text-left">
						<InfoCircle
							size={24}
							className="absolute top-0 left-0 m-2 shrink-0 text-blue-500 sm:relative"
						/>
						<div className="border-l-zinc-500 sm:ml-2 sm:border-l sm:pl-6">
							<p>
								Hospitalisierungen: Stand:{' '}
								{currentEntry.meta.currentAsOf.hospitalized.toLocaleDateString()}
							</p>
							<p>
								Intensivbelegung: Stand:{' '}
								{currentEntry.meta.currentAsOf.icuOccupation.toLocaleDateString()}
							</p>
							<p>
								Quelle:{' '}
								<ExternalLink
									className="text-zinc-800 underline dark:text-zinc-200 "
									href="https://www.lgl.bayern.de/gesundheit/infektionsschutz/infektionskrankheiten_a_z/coronavirus/karte_coronavirus/index.htm"
									rel="noreferrer noopener"
									target="_blank">
									Bayrisches Landesamt für Gesundheit und
									Lebensmittelsicherheit
								</ExternalLink>
							</p>
						</div>
					</div>
				</>
			)}
		</Section>
	);
};

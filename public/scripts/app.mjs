/** @format */

const mobileNav = {
	nav: document.querySelector('nav ul'),
	state: false,
	toggle() {
		!this.state
			? this.nav.setAttribute('state', true)
			: this.nav.setAttribute('state', false);

		this.state = !this.state;
	},
	init() {
		this.nav.setAttribute('state', false);

		window.addEventListener('click', (ev) => {
			if (ev.target.closest('#nav-mobile-button')) {
				this.toggle();
			}
			if (ev.target.closest('.nav-link')) {
				this.toggle();
			}
		});
	},
};

mobileNav.init();

/*

	The following code block handles all loaders. 

	- Loader.set - sets the loader to visible
	- Loader.close - closes the loader

*/

const Loader = {
	set(loader) {
		loader.style.display = 'flex';
	},
	close(loader) {
		loader.style.display = 'none';
	},
	dataLayer: document.querySelector('#data-loader'),
};

/*

	The following block handles error display

*/

const RenderError = (error, target) => {
	/*

		Create the error message

	*/

	const container = document.createElement('span');
	container.className = 'message-error';

	const message = document.createElement('p');
	message.textContent = `Fehler: ${error}`;

	const close = document.createElement('button');
	close.className = 'message-close';
	close.innerHTML = Pangolicons.icons.x.toString();

	/*

		Add a click event to the button to remove the container

	*/

	close.addEventListener('click', (ev) => {
		container.remove();
	});

	container.appendChild(message);
	container.appendChild(close);

	target.appendChild(container);
};

import {
	ValueWidget,
	TrafficLightWidget,
	HistoryWidget,
	VaccWidget,
} from './widget.mjs';

const RenderSrcContainer = ({ meta }) => {
	// extract the timestamps & create a new Date Object
	const timeStampHospitalized = new Date(meta.currentAsOf.hospitalized);
	const timeStampIcu = new Date(meta.currentAsOf.icuOccupation);

	const src = document.createElement('div');
	src.id = 'data-sources';
	src.innerHTML = `
		<p class="data-source-text">
			Daten zur Hospitalisierung aktualisiert:
			${timeStampHospitalized.toLocaleString(window.navigator.language)}
		</p>
		<p class="data-source-text">
			Daten zur Intensivbelegung aktualisiert:
			${timeStampIcu.toLocaleString(window.navigator.language)}
		</p>
		<p>Quelle: <a
		href="https://www.lgl.bayern.de/gesundheit/infektionsschutz/infektionskrankheiten_a_z/coronavirus/karte_coronavirus/index.htm"
		rel="norefferer noopener"
		target="_blank"
		>Bayrisches Landesamt für Gesundheit und
		Lebensmittelsicherheit</a
	></p>
	`;

	return src;
};

/*

    Fetch the Data from the backend

*/

const fetchDataFromSource = async () => {
	try {
		/*

			Fetch the history from the backend

		*/

		const res = await fetch('/api/data');
		const { history } = await res.json();

		// extract the most recent entry

		const data = history[history.length - 1];
		console.log(data);

		const dataDisplay = document.querySelector('#data-display');
		const dataLayer = document.querySelector('#data-widgets');

		/*

			Create the 4 main display widgets

		*/

		dataLayer.appendChild(new TrafficLightWidget(data).render());
		dataLayer.appendChild(
			new ValueWidget(data.hospitalizedIncidence).render()
		);
		dataLayer.appendChild(new ValueWidget(data.hospitalized7Days).render());
		dataLayer.appendChild(new ValueWidget(data.icuOccupation).render());

		const linegraph = new HistoryWidget(history);
		dataLayer.appendChild(linegraph.render());
		linegraph._constructLineGraph();

		dataLayer.appendChild(new VaccWidget(data.vaccination).render());

		dataDisplay.appendChild(RenderSrcContainer(data));

		/*

			Add the timestamp and source to the container

		*/
	} catch (e) {
		RenderError(e, document.querySelector('#data-display'));
	}

	Loader.close(Loader.dataLayer);
};

fetchDataFromSource();

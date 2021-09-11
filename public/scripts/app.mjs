/** @format */

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

/*

    Fetch the Data from the backend

*/

import { renderWidget, renderTrafficLight } from './widget.mjs';

const fetchDataFromSource = async () => {
	try {
		const res = await fetch('/api/data');
		const data = await res.json();

		console.log(data);

		const dataDisplay = document.querySelector('#data-display');
		const dataLayer = document.querySelector('#data-widgets');

		/*

			Create the trafficlight widget

		*/

		dataLayer.appendChild(renderTrafficLight(data));

		/*

			Create the 3 main display widgets

		*/

		dataLayer.appendChild(renderWidget(data.incidence));
		dataLayer.appendChild(renderWidget(data.hospitalization));
		dataLayer.appendChild(renderWidget(data.icuOccupancy));

		/*

			Add the timestamp and source to the container

		*/

		const timeStamp = new Date(data.meta.dataCurrentAsOf).toLocaleString(
			window.navigator.language
		);

		const linkContainer = document.createElement('span');
		linkContainer.className = 'data-display-timestamp';
		linkContainer.innerHTML = `Daten aktuell: ${timeStamp}. Quelle: <a
		href="https://www.lgl.bayern.de/gesundheit/infektionsschutz/infektionskrankheiten_a_z/coronavirus/karte_coronavirus/index.htm" rel="norefferer noopener"
		target="_blank" >Bayrisches Landesamt für Gesundheit und
		Lebensmittelsicherheit</a>`;

		dataDisplay.appendChild(linkContainer);
	} catch (e) {
		RenderError(e, document.querySelector('#data-display'));
	}

	Loader.close(Loader.dataLayer);
};

fetchDataFromSource();

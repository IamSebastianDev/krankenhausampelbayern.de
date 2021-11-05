/** @format */

import { RenderError } from './utilities/RenderError.mjs';
import { RenderBackdrop } from './utilities/RenderBackdrop.mjs';
import { ViewController } from './widgets/ViewController.mjs';
import { Spinner } from './utilities/Spinner.mjs';
import { WidgetModal } from './widgets/WidgetModal.mjs';

// create the controller and the widget modal

const Controller = new ViewController({
	targetElement: document.querySelector('#data-widgets'),
});

const WidgetPresenter = new WidgetModal({
	target: document.querySelector('.widget-modal'),
	Controller,
});

/**
 * Fetch the data from the api and pass it to the methods using them.
 */

(async () => {
	// define the endpoint and query

	const endpoint = './api/data';
	const query = '?timeframe=7';

	// fetch the data from the backend

	let request, response;

	try {
		request = await fetch(`${endpoint}`);
		response = await request.json();
	} catch (e) {
		RenderError(e, document.querySelector('#data-display'));
	}

	const { history, timeStamp } = response;

	// render the backdrop linegraphs

	RenderBackdrop(history);
	window.addEventListener('resize', () => {
		RenderBackdrop(history);
	});

	// create a new ViewController instance
	Controller.injectData(history);

	// remove the spinner
	Spinner.complete();
})();

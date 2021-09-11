/** @format */

/*


*/

const calculatePercentage = (data) => {
	if (data.threshold != 0) {
		return `(${((100 * data.value) / data.threshold).toFixed(2)}%)`;
	} else {
		return '';
	}
};

const renderWidget = (data) => {
	/*

        Create the widget body

    */

	const widget = document.createElement('div');
	widget.className = 'widget';
	widget.id = data.id;

	const title = document.createElement('h3');
	title.textContent = data.title.german.full;

	const hr = document.createElement('hr');

	const description = document.createElement('p');
	description.textContent = data.description.german;

	const valueContainer = document.createElement('div');
	valueContainer.className = 'widget-values';

	const trend = document.createElement('span');
	trend.innerHTML =
		data.trend == -1
			? Pangolicons.icons.arrowRightDown.toString({ 'stroke-width': 2 })
			: data.trend == 0
			? Pangolicons.icons.arrowRight.toString({ 'stroke-width': 2 })
			: Pangolicons.icons.arrowRightUp.toString({ 'stroke-width': 2 });

	trend.className = `widget-trend ${
		data.trend == -1 ? 'widget-trend-negative' : 'widget-trend-positive'
	}`;

	const number = document.createElement('span');
	number.textContent = data.value;

	if (data.threshold != undefined) {
		number.style.color =
			data.value > data.threshold
				? 'var(--ui-color-accent-contrast)'
				: 'var(--ui-color-accent-blue)';
	}

	const details = document.createElement('div');
	details.className = 'widget-details';

	const threshold = document.createElement('span');
	threshold.textContent = `${data.value} / ${data.threshold}`;

	const percentage = document.createElement('span');
	percentage.textContent = calculatePercentage(data);

	const change = document.createElement('span');

	const fixed = Number.isInteger(data.newCases)
		? data.newCases
		: data.newCases.toFixed(2);

	change.textContent = `${fixed >= 0 ? `+${fixed}` : `${fixed}`}`;
	change.style.color =
		fixed > 0
			? 'var(--ui-color-accent-contrast)'
			: fixed != 0
			? 'var(--ui-color-accent-blue)'
			: '';

	if (data.threshold == undefined) {
		threshold.textContent = '';
		percentage.textContent = '';
	}

	details.appendChild(threshold);
	details.appendChild(percentage);
	details.appendChild(change);

	widget.appendChild(title);
	widget.appendChild(hr);
	widget.appendChild(description);
	valueContainer.appendChild(trend);
	valueContainer.appendChild(number);
	widget.appendChild(valueContainer);
	widget.appendChild(details);

	return widget;
};

export { renderWidget };

/*

	Trafficlight Status widget render

*/

const renderTrafficLight = (data) => {
	/*

		Check the data for threshold 

	*/

	let stage;

	if (data.icuOccupancy.value > data.icuOccupancy.threshold) {
		stage = 3;
	} else if (data.hospitalization.value > data.hospitalization.threshold) {
		stage = 2;
	} else {
		stage = 1;
	}

	const widget = document.createElement('div');
	widget.className = 'widget';
	widget.id = 'trafficlight';

	const title = document.createElement('h3');
	title.textContent = 'Krankenhaus-Ampel Bayern';

	const hr = document.createElement('hr');

	const description = document.createElement('p');
	description.textContent =
		'Die Krankenhaus-Ampel gibt Auskunft über die momentane Auslastung des bayrischen Gesundheitssystem.';

	const valueContainer = document.createElement('div');
	valueContainer.className = 'widget-values';

	const trafficlight = document.createElement('span');
	trafficlight.className = 'widget-tl-ring';
	trafficlight.style =
		stage == 3
			? '--color-tl: rgba(195, 66, 63, 1);'
			: stage == 2
			? '--color-tl: rgba(253, 231, 76, 1);'
			: '--color-tl: rgba(107, 154, 8, 1);';

	const text = document.createElement('span');
	text.textContent = `Die bayrische Krankenhaus-Ampel steht zur Zeit auf ${
		stage == 3 ? 'Rot' : stage == 2 ? 'Gelb' : 'Grün'
	}`;

	valueContainer.appendChild(trafficlight);
	valueContainer.appendChild(text);

	const details = document.createElement('div');
	details.className = 'widget-link';
	details.innerHTML = `<a href="#ampel"> -> Aktuell geltenden Regelungen</a>`;

	widget.appendChild(title);
	widget.appendChild(hr);
	widget.appendChild(description);
	widget.appendChild(valueContainer);
	widget.appendChild(details);

	return widget;
};

export { renderTrafficLight };

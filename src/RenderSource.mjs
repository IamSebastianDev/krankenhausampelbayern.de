/** @format */

const RenderSource = ({ data, target } = {}) => {
	// icuOccupation
	// hospitalization
	const { currentAsOf } = data;

	const markup = document.createElement('div');
	markup.id = 'data-sources';
	markup.innerHTML = `
		<h3 class="source-heading">Daten zuletzt aktualisiert:</h3>
		<p>
			Intensivbelegung:
			<span class="source-date"
				>${new Date(currentAsOf.icuOccupation).toLocaleString()}</span
			>
		</p>
		<p>
			Hospitalisierung:
			<span class="source-date"
				>${new Date(currentAsOf.hospitalized).toLocaleString()}</span
			>
		</p>
	`;

	target.appendChild(markup);
};

export { RenderSource };

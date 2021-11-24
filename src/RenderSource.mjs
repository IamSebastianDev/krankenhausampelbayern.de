/** @format */

const RenderSource = ({ data, target } = {}) => {
	// icuOccupation
	// hospitalization
	const { currentAsOf } = data;

	const markup = document.createElement('div');
	markup.id = 'data-sources';
	markup.innerHTML = `
		<p>
			Die Daten der Intensivbelegung wurden zuletzt am 
			<span class="source-date"
				>${new Date(currentAsOf.icuOccupation).toLocaleDateString()}</span
			> aktualisiert.
		</p>
		<p>
		Die Daten der amHospitalisierung wurden zuletzt am 
			<span class="source-date"
				>${new Date(currentAsOf.hospitalized).toLocaleDateString()}</span
			> aktualisiert.
		</p>
		<p>
		Quelle: <a
		href="https://www.lgl.bayern.de/gesundheit/infektionsschutz/infektionskrankheiten_a_z/coronavirus/karte_coronavirus/index.htm"
		rel="norefferer noopener"
		target="_blank"
		>Bayrisches Landesamt für Gesundheit und
		Lebensmittelsicherheit</a
	>
		</p>
	`;

	target.appendChild(markup);
};

export { RenderSource };

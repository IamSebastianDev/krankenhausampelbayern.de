/** @format */

/*

    The entry class is used to create and provide a schema for the db entrys

*/
import { extractDatefromString } from './extractDateFromString.mjs';

class Entry {
	constructor({ src, data }) {
		this.meta = {
			created: Date.now(),
			currentAsOf: {
				hospitalized: this.#parseDateString(src.hospitalized),
				icuOccupation: this.#parseDateString(src.icuOccupation),
			},
		};

		this.hospitalized = {
			title: 'Hospitalisierungen',
			description:
				'Gesamte Anzahl an Hospitalisierungen aufgrund Covid-19.',
			threshold: undefined,
			unit: 'Fälle',
			value: parseInt(data.hospitalized.replace('.', '')) || 0,
			cases: parseInt(data.hospitalized.replace('.', '')) || 0,
			lastValue: data.hospitalized__oldValue,
		};

		this.hospitalized7Days = {
			title: 'Hospitalisierungen (7 Tage)',
			description:
				'Gesamte Anzahl an Hospitalisierungen aufgrund Covid-19 in den letzten 7 Tagen.',
			threshold: 1200,
			unit: 'Fälle',
			value: parseInt(data.hospitalized7Days.replace('.', '')) || 0,
			cases: parseInt(data.hospitalized7Days.replace('.', '')) || 0,
			lastValue: data.hospitalized7Days__oldValue,
		};

		this.hospitalizedIncidence = {
			title: 'Hospitalisierungen (Inzidenz)',
			description:
				'Gesamte Anzahl an Hospitalisierungen aufgrund Covid-19 in den letzten 7 Tagen per 100.000 Einwohner.',
			threshold: undefined,
			unit: undefined,
			value: parseFloat(
				data.hospitalizedIncidence.replace(',', '.') || 0
			),
			cases: parseFloat(
				data.hospitalizedIncidence.replace(',', '.') || 0
			),
			lastValue: data.hospitalizedIncidence__oldValue,
		};

		// Note: The LGL does no longer show deaths after 24/11/21, the datapoint is depreceated for now

		this.deaths7Days = {
			title: 'Sterbefälle (7 Tage)',
			description:
				'Anzahl der an Covid-19 verstorbenen der letzten 7 Tage.',
			threshold: undefined,
			unit: 'Fälle',
			value: 0,
			cases: 0,
			// value: parseInt(data.deaths7Days.replace('.', '')) || 0,
			// cases: parseInt(data.deaths7Days.replace('.', '')) || 0,
			// lastValue: data.deaths7Days__oldValue,
		};

		this.icuOccupation = {
			title: 'Intensivbelegung',
			description:
				'Anzahl der Patienten die mit Covid-19 intensivmedizinisch behandelt werden müssen.',
			threshold: 600,
			unit: 'Fälle',
			value: parseInt(data.icuOccupation) || 0,
			cases: parseInt(data.icuOccupation) || 0,
			lastValue: data.icuOccupation__oldValue,
		};

		this.cases7Days = {
			title: 'Covid-19 Fälle (7 Tage)',
			description:
				'Anzahl der gemeldenten Covid-19 Fälle in den letzten 7 Tagen.',
			threshold: undefined,
			unit: 'Fälle',
			value: parseInt(data.cases7Days.replace('.', '')) || 0,
			cases: parseInt(data.cases7Days.replace('.', '')) || 0,
			lastValue: data.cases7Days__oldValue,
		};

		this.incidence7Days = {
			title: 'Inzidenz (7 Tage)',
			description:
				'Anzahl der gemeldenten Covid-19 Fälle in den letzten 7 Tagen per 100.000 Einwohner.',
			threshold: undefined,
			unit: undefined,
			value: parseFloat(data.incidence7Days) || 0,
			cases: parseFloat(data.incidence7Days) || 0,
			lastValue: data.incidence7Days__oldValue,
		};

		this.rvalue = {
			title: 'Reproduktionszahl',
			description: 'Die Momentan ermittelte Reproduktionszahl (R-wert). ',
			threshold: undefined,
			unit: undefined,
			value: parseFloat(data.rvalue.replace(',', '.')) || 0,
			cases: parseFloat(data.rvalue.replace(',', '.')) || 0,
			lastValue: data.rvalue__oldValue,
		};

		this.vaccination = {
			title: 'Impfquote',
			description: 'Die aktuelle Impfquote für Bayern.',
			threshold: undefined,
			unit: '%',
			value: parseFloat(data.vaccination.replace(',', '.')) || 0,
			cases: parseFloat(data.vaccination.replace(',', '.')) || 0,
			lastValue: data.vaccination__oldValue,
		};
	}

	#parseDateString(dateString) {
		const string = extractDatefromString(dateString);
		const [day, month, year] = string.split(',')[0].split('.');
		// const [hour, minutes] = string.split(',')[1].split(':');
		return new Date(Date.UTC(year, month - 1, day));
	}

	export() {
		return {
			meta: this.meta,
			hospitalized: this.hospitalized,
			hospitalized7Days: this.hospitalized7Days,
			hospitalizedIncidence: this.hospitalizedIncidence,
			deaths7Days: this.deaths7Days,
			icuOccupation: this.icuOccupation,
			cases7Days: this.cases7Days,
			incidence7Days: this.incidence7Days,
			rvalue: this.rvalue,
			vaccination: this.vaccination,
		};
	}
}

export { Entry };

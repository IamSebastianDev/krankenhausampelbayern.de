/** @format */

/**

	The Schema class is used to provide a schema to parse the crawled from the provided source from.

*/

class Schema {
	constructor({
		dataCurrentAsOf,
		incidenceCurrentValue,
		incidenceLastValue,
		hospitalizationCurrentValue,
		hospitalizationLastValue,
		icuCurrentValue,
		icuLastValue,
		vaccinationCurrentValue,
		vaccinationLastValue,
	}) {
		this.meta = {
			timeStamp: Date.now(),
			dataCurrentAsOf: this.#parseDate(dataCurrentAsOf),
		};

		this.incidence = {
			id: 'incidence',
			title: {
				german: {
					full: 'Inzidenz (Hospitalisierungen)',
					short: 'Inzidenz (Hospi.)',
				},
				english: {
					full: 'Incidence (Hospitalizations)',
					short: 'Incidence (Hospi.)',
				},
			},
			description: {
				german: 'Hospitalisierungen der letzten 7 Tage per 100.000 Einwohner:',
				english:
					'Hospitalizations in the last 7 days per 100.000 citizens:',
			},
			threshold: undefined,
			value: incidenceCurrentValue,
			currentValue: incidenceCurrentValue,
			lastValue: incidenceLastValue,
			newCases: this.#calculateNewCases(
				incidenceCurrentValue,
				incidenceLastValue
			),
			trend: this.#calculateTrend(
				incidenceCurrentValue,
				incidenceLastValue
			),
		};

		this.hospitalization = {
			id: 'hospitalization',
			title: {
				german: { full: 'Hospitalisierungen', short: 'Hospi.' },
				english: { full: 'Hospitalizations', short: 'Hospi.' },
			},
			description: {
				german: 'Gesamte Anzahl der Hospitalisierungen aufgrund Covid-19 in den letzten 7 Tage:',
				english:
					'Amout of patients currently hospitalized with covid-19:',
			},
			threshold: 1200,
			value: hospitalizationCurrentValue,
			currentValue: hospitalizationCurrentValue,
			lastValue: hospitalizationLastValue,
			newCases: this.#calculateNewCases(
				hospitalizationCurrentValue,
				hospitalizationLastValue
			),
			trend: this.#calculateTrend(
				hospitalizationCurrentValue,
				hospitalizationLastValue
			),
		};
		this.icuOccupancy = {
			id: 'icuoccupancy',
			title: {
				german: { full: 'Intensivbelegung', short: 'Intensivb.' },
				english: {
					full: 'Intensive Care Unit occupation.',
					short: 'ICU occu.',
				},
			},
			description: {
				german: 'Anzahl der Patienten auf der Intensivstation aufgrund Covid-19:',
				english:
					'Amout of patients currently requiring intensive care because of covid-19:',
			},
			threshold: 600,
			value: icuCurrentValue,
			currentValue: icuCurrentValue,
			lastValue: icuLastValue,
			newCases: this.#calculateNewCases(icuCurrentValue, icuLastValue),
			trend: this.#calculateTrend(icuCurrentValue, icuLastValue),
		};
		this.vaccination = {
			id: 'vaccinations',
			title: {
				german: { full: 'Impfquote', short: 'Impfq.' },
				english: {
					full: 'Vaccination rate',
					short: 'Vaccinations',
				},
			},
			description: {
				german: 'Anzahl der vollständig geimpften Personen',
				english: 'Amount of fully vaccinated citizens.',
			},
			value: vaccinationCurrentValue,
			currentValue: vaccinationCurrentValue,
			lastValue: vaccinationLastValue,
			newCases: this.#calculateNewCases(
				vaccinationCurrentValue,
				vaccinationLastValue
			),
			trend: this.#calculateTrend(
				vaccinationCurrentValue,
				vaccinationLastValue
			),
		};
	}

	#parseDate(date) {
		return new Date(date.trim());
	}
	#calculateNewCases(currentValue, oldValue) {
		return currentValue - oldValue;
	}
	#calculateTrend(currentValue, oldValue) {
		return currentValue > oldValue ? 1 : currentValue < oldValue ? -1 : 0;
	}

	/**
	
		@public
		@description method to export the data parsed into the Schema
	
		@returns { Object } the object containing the parsed in data

	*/

	export() {
		return {
			meta: this.meta,
			incidence: this.incidence,
			hospitalization: this.hospitalization,
			icuOccupancy: this.icuOccupancy,
			vaccination: this.vaccination,
		};
	}
}

export { Schema };

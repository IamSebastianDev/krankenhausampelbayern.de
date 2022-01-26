/** @format */

/**
 * This file contains methods to manipulate the db
 */

import { accessDB } from '../../config/mongo.config.mjs';
import { extractDateString } from './dateUtilities.mjs';

/**
 *
 * A utility function that accesses the db and returns the complete collection
 *
 * @returns { Promise<{}[]> } an array of objects containing all data inside the collection
 */

export const fetchHistory = async () =>
	await accessDB('data', (col) => col.find().toArray());

/**
 *
 * A utility function that accesses the db and adds data to the collection
 * @param { * } data - the data to append to the database
 *
 * @returns { Promise<*> } an the result of the operation
 */

export const insertHistory = async (data) =>
	await accessDB('data', (col) => col.insertOne(data));

/**
 * The db Schema for the V2 Api is significantly slimmed down in contrast to the V1 Api. It will no longer contain the
 * textual description, names or the data from the entry before. This will remove a great amount of duplicate data.
 * Unfortunately, that also means a breaking change for all current consumers. There also needs to be an adapter on the
 * frontend that will convert the returned raw data into the complete data set once consumed.
 *
 * The Schema takes an object containg the data extracted by the page crawler as argument, and will convert the
 * extracted raw DOM text strings into their respective type.
 */

export class Schema {
	constructor({
		hospitalized,
		hospitalized7Days,
		hospitalizedIncidence,
		icuOccupation,
		cases7Days,
		incidence7Days,
		rvalue,
		vaccinated,
		src,
	}) {
		/**
		 *
		 * @property meta
		 * @type { Object } - the meta property is an object containing a timestamp indicating when this db entry was
		 * created and a object containing the timestamps of the current data sets
		 *
		 */

		this.meta = {
			createdAt: Date.now(),
			currentAsOf: {
				hospitalized: this.#parseDateString(src.hospitalized),
				icuOccupation: this.#parseDateString(src.icuOccupation),
			},
		};

		/**
		 * The total amount of cases hospitalized with covid19
		 * @type { number }
		 */

		this.hospitalized = parseInt(hospitalized.replace('.', '')) || 0;

		/**
		 * The amount of cases hospitalized with covid19 in the last 7 days
		 * @type { number }
		 */

		this.hospitalized7Days =
			parseInt(hospitalized7Days.replace('.', '')) || 0;

		/**
		 * The current hospitalization incidence (hospitalized cases per 100k citizens over the last 7 days)
		 * @type { number }
		 */

		this.hospitalizedIncidence = parseFloat(
			hospitalizedIncidence.replace(',', '.') || 0
		);

		/**
		 * The amount of patients currently requiring intensive care because of covid19
		 * @type { number }
		 */

		this.icuOccupation = parseInt(icuOccupation.replace('.', '')) || 0;

		/**
		 * The amount of reported cases in the last 7 days
		 * @type { number }
		 */

		this.cases7Days = parseInt(cases7Days.replace('.', '')) || 0;

		/**
		 * The current 7 days incidence (reported cases per 100k citizens over the last 7 days)
		 */

		this.incidence7Days = parseFloat(incidence7Days) || 0;

		/**
		 * The current measured rValue
		 * @type { number }
		 */

		this.rvalue = parseFloat(rvalue.replace(',', '.')) || 0;

		/**
		 * The percentage of citizens currently vaccinated completly
		 * @type { number }
		 */

		this.vaccinated = parseFloat(vaccinated.replace(',', '.')) || 0;
	}

	/**
	 *
	 * A utility method to convert a string into a date
	 *
	 * @param { string } dateString
	 * @returns { Date }
	 */

	#parseDateString(dateString) {
		const string = extractDateString(dateString);
		const [day, month, year] = string.split(',')[0].split('.');
		return new Date(Date.UTC(year, month - 1, day));
	}
}

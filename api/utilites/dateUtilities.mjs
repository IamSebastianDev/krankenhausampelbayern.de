/** @format */

/**
 * Utility method to extract the date from a given string
 *
 * @param { string } string - the string to extract the date from
 * @returns { string } the extracted string
 */

export const extractDateString = (string) =>
	string
		.match(/Datenstand[0-9., :]*/gim)[0]
		.replace('Datenstand:', '')
		.trim();

/**
 *
 * A utility method to compare two dates against each other. The method will return true if all dates passed are equal,
 * and return false if this is not the case.
 *
 * @param  { ...string } dates - the date strings to compare
 *
 * @returns { boolean } true if all dates are equal, false if not
 */

export const areDatesEqual = (...dates) =>
	dates[0].toLocaleString() === dates[1].toLocaleString();

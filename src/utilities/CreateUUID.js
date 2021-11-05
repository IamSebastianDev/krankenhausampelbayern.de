/** @format */

/** @todo: Impove documetation for utility method */

/**
 *
 * @description method to create a string of numbers and characters to create a randomized identifier.
 *
 * @param { Object } param1 - the Object passed to the method containing the block and group properties
 * @param { Number } param1.block - the amount of characters inside a group
 * @param { Number } param1.group - the amount of groups that make up the id, they are seperated by a dash
 *
 * @returns { String } the created identifier
 *
 */

const createUUID = ({ block = 4, group = 4 } = {}) => {
	// all available chars to generate from

	const chars = 'abcdefghijklmnopqrstuvxyz0123456789';
	const charSet = chars.length;
	const id = [];

	// generate and join the blocks

	for (let i = 0; i < group; i++) {
		let group = [];

		for (let j = 0; j < block; j++) {
			group.push(chars[Math.floor(Math.random() * charSet) * 1]);
		}

		id.push(group.join(''));
	}

	return id.join('-');
};

export default createUUID;

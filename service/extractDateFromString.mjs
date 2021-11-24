/** @format */

const extractDatefromString = (string) => {
	return string
		.match(/Stand[0-9., :]*/gim)[0]
		.replace('Stand:', '')
		.trim();
};

export { extractDatefromString };

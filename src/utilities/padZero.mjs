/** @format */

const padZero = (dateString) => {
	const day = dateString.split('.')[0];

	if (day.length === 1) {
		return '0' + dateString;
	}

	return dateString;
};

export { padZero };

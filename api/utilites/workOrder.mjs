/** @format */

/**
 * Due to the LGL Bayern constantly changing the layout of the page, a more flexible crawler is needed to guarantee
 * fast adapabilty. The object below is used to extract the expected data from the DOM in a modular way. While the
 * workorder in itslef is pretty boilerplatey, it enables us to quickly adapt to breaking layout changes.
 *
 * The workorder will return an object with two properties, data and src. The data property contains the crawled raw
 * data that will need to be parsed and cleaned, as well as two date strings which serve as src timestamps.
 *
 * To create a new order, add a object to the respective property. It needs to contain  a valid CSS
 * selector to serach for and a callback that will be executed on that selector. The data returned by the
 * callback will be data point added to the results object.
 */

export const workOrder = {
	data: {
		hospitalized: {
			selector:
				'#kennzahlen2 > div:nth-child(2) > div > div.card > div > p.card-text > strong',
			callback: (nodeList) => {
				const elem = nodeList[0];

				const dataPoint = elem.textContent
					.trim()
					.split(/\n/gim)[0]
					.trim();

				const [value] = dataPoint.split(' ');

				return value;
			},
		},
		hospitalized7Days: {
			selector:
				'#kennzahlen2 > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > p > strong',
			callback: (nodeList) => {
				const elem = nodeList[0];

				const dataPoint = elem.textContent
					.trim()
					.split(/ /gim)[0]
					.trim();

				return dataPoint;
			},
		},
		hospitalizedIncidence: {
			selector:
				'#kennzahlen2 > div:nth-child(1) > div:nth-child(2) > div.card-body > p.card-text > strong',
			callback: (nodeList) => {
				const elem = nodeList[0];

				const dataPoint = elem.textContent
					.trim()
					.split(/\n/gim)[0]
					.trim();

				return dataPoint;
			},
		},
		icuOccupation: {
			selector:
				'#kennzahlen2 > div:nth-child(2) > div > div:nth-child(1) > p > strong',
			callback: (nodeList) => {
				const elem = nodeList[0];

				const dataPoint = elem.textContent
					.trim()
					.split(/\n/gim)[0]
					.trim();

				return dataPoint;
			},
		},
		cases7Days: {
			selector:
				'#kennzahlen2 > div:nth-child(3) > div > dl > dd:nth-child(4)',
			callback: (nodeList) => {
				const elem = nodeList[0];

				const dataPoint = elem.textContent
					.trim()
					.split(/\n/gim)[0]
					.trim();

				return dataPoint;
			},
		},
		incidence7Days: {
			selector: '#kennzahlen2 > div:nth-child(3) > div > p.card-text',
			callback: (nodeList) => {
				const elem = nodeList[0];

				const dataPoint = elem.textContent
					.trim()
					.split(/\n/gim)[0]
					.trim();

				return dataPoint;
			},
		},
		rvalue: {
			selector:
				'#kennzahlen2 > div:nth-child(3) > div > dl > dd:nth-child(2)',
			callback: (nodeList) => {
				const elem = nodeList[0];

				const dataPoint = elem.textContent
					.trim()
					.split(/\n/gim)[0]
					.trim();

				return dataPoint;
			},
		},
		vaccinated: {
			selector:
				'#kennzahlen2 > div:nth-child(4) > div > dl > dd:nth-child(2)',
			callback: (nodeList) => {
				const elem = nodeList[0];

				const dataPoint = elem.textContent
					.trim()
					.split(/\n/gim)[0]
					.trim();

				return dataPoint;
			},
		},
	},
	src: {
		hospitalized: {
			selector:
				'#kennzahlen2 > div:nth-child(1) > div:nth-child(1) > div:nth-child(5) > p',
			callback: (nodeList) => {
				return nodeList[0].textContent.trim().split(/\n/)[0].trim();
			},
		},
		icuOccupation: {
			selector:
				'#kennzahlen2 > div:nth-child(2) > div > div:nth-child(5) > p',
			callback: (nodeList) => {
				return nodeList[0].textContent.trim().split(/\n/)[1].trim();
			},
		},
	},
};

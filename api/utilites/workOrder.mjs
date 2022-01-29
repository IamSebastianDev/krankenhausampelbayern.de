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
			selector: '.jumbotron',
			callback: (nodeList) => {
				const elem = nodeList[4];

				const dataPoint = elem
					.querySelectorAll('.horizontal_zwei dd')[1]
					.textContent.trim()
					.split(/\n/gim)[0]
					.trim();

				return dataPoint;
			},
		},
		hospitalized7Days: {
			selector: '#kennzahlen2 .card strong',
			callback: (nodeList) => {
				return nodeList[0].textContent.trim().split(/\n/gim)[0].trim();
			},
		},
		hospitalizedIncidence: {
			selector: '.jumbotron',
			callback: (nodeList) => {
				const elem = nodeList[3];

				const dataPoint = elem
					.querySelectorAll('.horizontal_zwei dd')[0]
					.textContent.trim()
					.split(/\n/gim)[0]
					.trim();

				return dataPoint;
			},
		},
		icuOccupation: {
			selector: '#kennzahlen2 .card strong',
			callback: (nodeList) => {
				return nodeList[1].textContent.trim().split(/\n/gim)[0].trim();
			},
		},
		cases7Days: {
			selector: '.jumbotron',
			callback: (nodeList) => {
				const elem = nodeList[5];

				const dataPoint = elem
					.querySelectorAll('.horizontal_zwei dd')[1]
					.textContent.trim()
					.split(/\n/gim)[0]
					.trim();

				return dataPoint;
			},
		},
		incidence7Days: {
			selector: '.jumbotron',
			callback: (nodeList) => {
				const elem = nodeList[5];

				const dataPoint = elem
					.querySelectorAll('.horizontal_zwei dd')[2]
					.textContent.trim()
					.split(/\n/gim)[0]
					.trim();

				return dataPoint;
			},
		},
		rvalue: {
			selector: '.jumbotron',
			callback: (nodeList) => {
				const elem = nodeList[5];

				const dataPoint = elem
					.querySelectorAll('.horizontal_zwei dd')[0]
					.textContent.trim()
					.split(/\n/gim)[0]
					.trim();

				return dataPoint;
			},
		},
		vaccinated: {
			selector: '.jumbotron',
			callback: (nodeList) => {
				const elem = nodeList[6];

				const dataPoint = elem
					.querySelectorAll('.horizontal_vier dd')[0]
					.textContent.trim()
					.split(/\n/gim)[0]
					.trim();

				return dataPoint;
			},
		},
	},
	src: {
		hospitalized: {
			selector: '.card .bildunterschrift',
			callback: (nodeList) => {
				return nodeList[0].textContent.split(/\n/gim)[0].trim();
			},
		},
		icuOccupation: {
			selector: '.card .bildunterschrift',
			callback: (nodeList) => {
				return nodeList[1].textContent.split(/\n/gim)[0].trim();
			},
		},
	},
};

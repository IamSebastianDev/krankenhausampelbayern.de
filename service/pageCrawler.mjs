/** @format */

/**
 *
 *  The pageCrawler is the newest attempt to build a robust crawler, that can be easily configured to retrieve data
 *  from the Website of the LGL after they deceide to update the layout again, breaking the whole api.
 *
 */

/**
 *
 * @param { {
 *  page: Page,
 *  workOrder: {}
 * } } param0 - the object psaseed to the the method containing the pupeteeer page to operate on and the object
 * containing the selectors and callbacks for the selectors.
 *
 */

const pageCrawler = async ({ page, workOrder }) => {
	// get the categories from the workOrder object
	const { data, src } = workOrder;

	// initalize a empty object with the categoies to be filled

	const parsedData = {
		data: {},
		src: {},
	};

	const itterate = async (object, category) => {
		for (const name in object) {
			if (Object.hasOwnProperty.call(object, name)) {
				const order = object[name];

				const res = await page.$$eval(
					`${order.selector}`,
					order.callback
				);

				category[name] = res;
			}
		}
	};

	await itterate(data, parsedData.data);
	await itterate(src, parsedData.src);

	return parsedData;
};

// the object containing the different data points and methods to access them.

const workOrder = {
	data: {
		hospitalized: {
			category: 'data',
			selector: '.jumbotron',
			callback: (nodeList) => {
				// get the second jumbotron element

				const elem = nodeList[1];

				const dataPoint = elem
					.querySelectorAll('.horizontal_zwei dd')[1]
					.textContent.trim()
					.split(/\n/gim)[0]
					.trim();

				return dataPoint;
			},
		},
		hospitalized7Days: {
			category: 'data',
			selector: '#kennzahlen2 .card strong',
			callback: (nodeList) => {
				return nodeList[0].textContent.trim().split(/\n/gim)[0].trim();
			},
		},
		hospitalizedIncidence: {
			category: 'data',
			selector: '.jumbotron',
			callback: (nodeList) => {
				// get the second jumbotron element

				const elem = nodeList[0];

				const dataPoint = elem
					.querySelectorAll('.horizontal_vier dd')[0]
					.textContent.trim()
					.split(/\n/gim)[0]
					.trim();

				return dataPoint;
			},
		},
		icuOccupation: {
			category: 'data',
			selector: '#kennzahlen2 .card strong',
			callback: (nodeList) => {
				return nodeList[1].textContent.trim().split(/\n/gim)[0].trim();
			},
		},
		cases7Days: {
			cateogry: 'data',
			selector: '.jumbotron',
			callback: (nodeList) => {
				// get the second jumbotron element

				const elem = nodeList[2];

				const dataPoint = elem
					.querySelectorAll('.horizontal_zwei dd')[1]
					.textContent.trim()
					.split(/\n/gim)[0]
					.trim();

				return dataPoint;
			},
		},
		incidence7Days: {
			cateogry: 'data',
			selector: '.jumbotron',
			callback: (nodeList) => {
				// get the second jumbotron element

				const elem = nodeList[2];

				const dataPoint = elem
					.querySelectorAll('.horizontal_vier dd')[0]
					.textContent.trim()
					.split(/\n/gim)[0]
					.trim();

				return dataPoint;
			},
		},
		rvalue: {
			cateogry: 'data',
			selector: '.jumbotron',
			callback: (nodeList) => {
				// get the second jumbotron element

				const elem = nodeList[2];

				const dataPoint = elem
					.querySelectorAll('.horizontal_zwei dd')[0]
					.textContent.trim()
					.split(/\n/gim)[0]
					.trim();

				return dataPoint;
			},
		},
		vaccination: {
			cateogry: 'data',
			selector: '.jumbotron',
			callback: (nodeList) => {
				// get the second jumbotron element

				const elem = nodeList[2];

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
			category: 'sources',
			callback: (nodeList) => {
				return nodeList[0].textContent.split(/\n/gim)[0].trim();
			},
		},
		icuOccupation: {
			selector: '.card .bildunterschrift',
			category: 'sources',
			callback: (nodeList) => {
				return nodeList[1].textContent.split(/\n/gim)[0].trim();
			},
		},
	},
};

export { pageCrawler, workOrder };

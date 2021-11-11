/** @format */

const RenderBackdrop = (dataSet) => {
	const canvas = document.querySelector('#data-backdrop');
	const ctx = canvas.getContext('2d');

	const width = window.innerWidth;
	const height = window.innerHeight - 62;

	canvas.width = width * 2 * window.devicePixelRatio;
	canvas.height = height * 2 * window.devicePixelRatio;

	canvas.style.width = width + 'px';
	canvas.style.height = height + 'px';

	const colorITS = 'rgba(255, 90, 95, 0.05)';
	const colorHOS = 'rgba(57, 160, 237, 0.05)';

	// map the data points to an array of objects containing the date and value

	const casesITS = dataSet.map((entry) => entry.icuOccupation.value);
	const casesHOS = dataSet.map((entry) => entry.hospitalized7Days.value);

	// console.log({ casesITS, casesHOS });

	const paintGraph = (values, color, max) => {
		// calculate the width between dataPoints by dividing the canvas width by the number of dataPoints

		const numberOfValues = values.length - 1;
		const columnWidth = canvas.width / numberOfValues;
		const rowHeight = canvas.height / max / 2;

		// create the path and then itterate over the points to create the graph
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = 10;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		ctx.moveTo(0, canvas.height - values[0] * rowHeight);

		values.forEach((point, index) => {
			ctx.lineTo(index * columnWidth, canvas.height - point * rowHeight);
		});

		ctx.stroke();
		ctx.strokeStyle = 'transparent';

		ctx.lineTo(canvas.width, canvas.height);
		ctx.lineTo(0, canvas.height);

		ctx.fillStyle = color;
		ctx.fill();
	};

	const render = () => {
		// reset the created canvas;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		paintGraph(casesITS, colorITS, 600);
		paintGraph(casesHOS, colorHOS, 1200);
	};

	window.requestAnimationFrame(render);
};

export { RenderBackdrop };

/** @format */

/*

	Create a DOM Parser instance that the Widgets can use

*/

const Parser = new DOMParser();
const parseHTMLFromString = (string) =>
	Parser.parseFromString(string, 'text/html');

/*

	@description Base Class for all widgets to extend for creation


*/
class Widget {
	_widgetSize;
	constructor({ widgetTitle, widgetDescription, widgetSize, widgetId }) {
		this._widgetSize = widgetSize;
		this.widgetTitle = widgetTitle;
		this.widgetDescription = widgetDescription;
		this.widgetId = widgetId;
	}
	renderShell() {
		const [title, ...detail] = this.widgetTitle.split(' ');

		const string = `
			<div
				class="widget"
				id="${this.widgetId}"
				${this._getGridSize(this._widgetSize)}
			>
				<div class="widget-text">
					<h3 class="widget-title">${title}<span style="font-size: 0.7em; color: var(--ui-color-light-shade)"> ${detail.join(
			' '
		)}</span></h3>
					<hr />
					<p class="widget-description">${this.widgetDescription}</p>
				</div>
				<div class="widget-content"></div>
			</div>
		`;

		return parseHTMLFromString(string);
	}
	_getGridSize(widgetSize) {
		switch (widgetSize) {
			case 'small':
				return ``;
			case 'medium':
				return `style="grid-column: span 2; width: unset;"`;
			case 'large':
				return `style="grid-column: span 3; width: unset;"`;
			default:
				return ``;
		}
	}
}

class ValueWidget extends Widget {
	constructor(data) {
		super({
			widgetTitle: data.title.german.full,
			widgetDescription: data.description.german,
			widgetSize: 'small',
			widgetId: data.id,
		});

		this.data = data;
	}

	render() {
		const shell = this.renderShell();
		const widget = shell.querySelector('.widget');

		const content = `
			<div class="widget-values">
				<span class="widget-trend" ${
					this.data.trend > 0
						? `style="color: var(--ui-color-accent-contrast)";`
						: this.data.trend == 0
						? ''
						: `style="color: var(--ui-color-accent-teal)";`
				} >${this._calculateTrend()}</span>
				<span class="widget-cases" ${
					this.data.threshold != undefined
						? this.data.value > this.data.threshold
							? `style="color: var(--ui-color-accent-contrast)";`
							: this.data.value == this.data.threshold
							? ''
							: `style="color: var(--ui-color-accent-blue)";`
						: ''
				} 	
					>${this.data.value}</span
				>
			</div>
			<div class="widget-details">
				<span class="widget-value-threshold" ${
					this.data.value > this.data.threshold
						? `style="color: var(--ui-color-accent-contrast);"`
						: ``
				}
					>${
						this.data.threshold != undefined
							? `${this.data.value} / ${this.data.threshold}`
							: ''
					}</span
				>
				<span class="widget-value-percentage">
					${
						this.data.threshold != undefined
							? `${this._calculatePercentage(
									this.data.value,
									this.data.threshold
							  )}`
							: ''
					}
				</span>
				<span class="widget-value-newCases" ${
					this.data.newCases > 0
						? `style="color: var(--ui-color-accent-contrast)";`
						: `style="color: var(--ui-color-accent-blue"; `
				}>
					${
						this.data.newCases != undefined
							? `${
									Number.isInteger(this.data.newCases)
										? `${
												this.data.newCases >= 0
													? `+${this.data.newCases}`
													: this.data.newCases
										  }`
										: this.data.newCases.toFixed(2)
							  }`
							: ''
					}
				</span>
			</div>
		`;

		widget.querySelector('.widget-content').innerHTML = content;
		return widget;
	}

	_calculatePercentage(value, threshold) {
		return `(${((100 * value) / threshold).toFixed(2)}%)`;
	}

	_calculateTrend() {
		return this.data.trend > 0
			? Pangolicons.icons.arrowRightUp.toString({ 'stroke-width': 2 })
			: this.data.trend == 0
			? Pangolicons.icons.arrowRight.toString({
					'stroke-width': 2,
			  })
			: Pangolicons.icons.arrowRightDown.toString({
					'stroke-width': 2,
			  });
	}
}

class TrafficLightWidget extends Widget {
	constructor(data) {
		super({
			widgetTitle: 'Krankenhaus-Ampel Bayern',
			widgetDescription:
				'Die Krankenhaus-Ampel gibt Auskunft über die momentane Auslastung des bayrischen Gesundheitssystem.',
			widgetSize: 'small',
			widgetId: 'trafficLight',
		});

		this.data = data;
	}

	render() {
		const shell = this.renderShell();
		const widget = shell.querySelector('.widget');

		const stage = this._calculateCurrentStage(this.data);

		const content = `
			<div class="widget-values">
				<span
					style="${
						stage == 2
							? '--color-tl: rgba(195, 66, 63, 1);'
							: stage == 1
							? '--color-tl: rgba(253, 231, 76, 1);'
							: '--color-tl: rgba(107, 154, 8, 1);'
					}"
					class="widget-trafficLight"
				></span>
				<span class="widget-trafficText">
					Die bayrische Krankenhaus-Ampel steht zur Zeit auf
					${stage == 2 ? `Rot` : stage == 1 ? 'Gelb' : 'Grün'}.
				</span>
			</div>
			<div class="widget-details">
				<a
					class="widget-link"
					style="grid-column: 1 / 5;"
					href="https://www.stmgp.bayern.de/coronavirus/#kh-ampel"
					target="_blank"
					rel="norefferer noopener"
					>&rarr; Aktuell geltende Regelungen</a
				>
			</div>
		`;

		widget.querySelector('.widget-content').innerHTML = content;
		return widget;
	}

	_calculateCurrentStage(data) {
		if (data.icuOccupancy.value > data.icuOccupancy.threshold) {
			return 2;
		} else if (
			data.hospitalization.value > data.hospitalization.threshold
		) {
			return 1;
		} else {
			return 0;
		}
	}
}

class HistoryWidget extends Widget {
	constructor(data) {
		super({
			widgetTitle: 'Intensivbelegung (ltz. 7 Tage)',
			widgetDescription: '',
			widgetSize: 'medium',
			widgetId: 'history',
		});

		this.data = data;
		this.canvasId = '_7daytrend';

		console.log(data);
	}

	render() {
		const shell = this.renderShell();
		const widget = shell.querySelector('.widget');

		const content = `<canvas id="${this.canvasId}" ></canvas>`;
		this.wContent = widget.querySelector('.widget-content');
		this.wContent.style =
			'display: inline-block; height: -webkit-fill-available';

		this.wContent.innerHTML = content;
		return widget;
	}
	_constructLineGraph() {
		const canvas = document.querySelector(`#${this.canvasId}`);
		const ctx = canvas.getContext('2d');

		/*

			Find the size of the surrounding element and set the canvas size

		*/

		const { width, height } = this.wContent.getBoundingClientRect();

		canvas.width = width * 2;
		canvas.height = height * 2;

		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';

		/*

			Create useful constants

		*/

		const padding = 40;
		const columnWidth = parseInt((canvas.width - padding * 2) / 6);

		// figuring out how many pixels convert to a case
		const canvasHeight = (canvas.height - padding * 2) / 600;

		/*

			create the x/y coordinates to go with the data

		*/

		const valuesICU = this.parseData(this.data, 'icuOccupancy');
		const pointsICU = valuesICU.map((value, index) => {
			return { value, column: index * columnWidth + padding };
		});

		const dates = this.data.map((entry) =>
			entry != null ? entry.meta.dataCurrentAsOf : 0
		);

		const drawAxis = (dates) => {
			ctx.beginPath();
			ctx.lineWidth = 5;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.strokeStyle = 'rgba(255,255,255,0.5)';

			// draw the x axis;
			ctx.moveTo(0 + padding, canvas.height - padding);
			ctx.lineTo(canvas.width - padding, canvas.height - padding);

			ctx.stroke();

			// style the text

			ctx.font = `18px sans-serif`;
			ctx.textAlign = 'center';

			dates.forEach((date, index) => {
				if (date == 0) {
					return;
				}

				const weekDay = new Date(date).getDay();
				if (weekDay == 0 || weekDay == 6) {
					ctx.fillStyle = 'rgba(255,255,255,1)';
				} else {
					ctx.fillStyle = 'rgba(255,255,255,0.6)';
				}

				ctx.fillText(
					new Date(date).toLocaleDateString('de-DE', {
						day: 'numeric',
						month: 'numeric',
					}),
					index * columnWidth + padding,
					canvas.height - 10,
					columnWidth
				);
			});

			// draw y axis

			ctx.moveTo(0 + padding, canvas.height - padding);
			ctx.lineTo(0 + padding, 0 + padding);

			for (let i = 0; i < 3; i++) {
				ctx.moveTo(
					0 + padding,
					canvas.height - padding - canvasHeight * i * 200
				);
				ctx.lineTo(
					canvas.width - padding,
					canvas.height - padding - canvasHeight * i * 200
				);

				// draw y axis labels
				ctx.fillStyle = 'rgba(255,255,255,0.5)';
				ctx.font = '20px sans-serif';
				ctx.textAlign = 'left';
				ctx.fillText(
					i * 200,
					0 + padding + 10,
					canvas.height - padding - canvasHeight * i * 200 - 12
				);
			}

			ctx.stroke();
		};

		drawAxis(dates);

		/*

			Construct the linegraph

		*/

		const drawLinegraph = (points, color) => {
			ctx.beginPath();
			ctx.lineWidth = 5;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.strokeStyle = color;
			ctx.moveTo(0 + padding, canvas.height - padding);

			points.forEach((point) => {
				ctx.lineTo(
					point.column,
					canvas.height - canvasHeight * point.value - padding
				);
			});

			ctx.stroke();
		};

		drawLinegraph(pointsICU, 'rgba(255, 90, 95, 1)');
	}
	parseData(data, key) {
		return data.map((entry) => (entry != null ? entry[key].value : 0));
	}
}

export { ValueWidget, TrafficLightWidget, HistoryWidget };

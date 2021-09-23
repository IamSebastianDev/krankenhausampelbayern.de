/** @format */

/**

	@todo: Refractor the widget code. 

*/

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
				class="widget ${this._getGridSize(this._widgetSize)}"
				id="${this.widgetId}"
				
			>
				<div class="widget-text">
					<h3 class="widget-title">${title}<span style="font-size: 0.6em; color: var(--ui-color-light-shade); text-transform: uppercase;"> ${detail.join(
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
				return `widget-small`;
			case 'medium':
				return `widget-medium`;
			case 'large':
				return `widget-large`;
			default:
				return ``;
		}
	}

	_calculateTrend(trend) {
		return trend > 0
			? Pangolicons.icons.arrowRightUp.toString({ 'stroke-width': 2 })
			: trend == 0
			? Pangolicons.icons.arrowRight.toString({
					'stroke-width': 2,
			  })
			: Pangolicons.icons.arrowRightDown.toString({
					'stroke-width': 2,
			  });
	}
}

class ValueWidget extends Widget {
	constructor(data) {
		super({
			widgetTitle: data.title,
			widgetDescription: data.description,
			widgetSize: 'small',
			widgetId: undefined,
		});

		this.data = data;
	}

	render() {
		const shell = this.renderShell();
		const widget = shell.querySelector('.widget');

		const oldValue = this.data.lastValue != null ? this.data.lastValue : 0;
		const newCases = this.data.value - oldValue;

		const trend = newCases > 0 ? 1 : newCases == 0 ? 0 : -1;

		const content = `
			<div class="widget-values">
				<span class="widget-trend" ${
					trend > 0
						? `style="color: var(--ui-color-accent-contrast)";`
						: trend == 0
						? ''
						: `style="color: var(--ui-color-accent-teal)";`
				} >${this._calculateTrend(trend)}</span>
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
					newCases > 0
						? `style="color: var(--ui-color-accent-contrast)";`
						: `style="color: var(--ui-color-accent-blue"; `
				}>
					${
						newCases != undefined
							? `${
									Number.isInteger(newCases)
										? `${
												newCases >= 0
													? `+${newCases}`
													: newCases
										  }`
										: `+${newCases.toFixed(2)}`
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
}

class VaccWidget extends Widget {
	constructor(data) {
		super({
			widgetTitle: data.title,
			widgetDescription: data.description,
			widgetSize: 'small',
			widgetId: data.id,
		});

		this.data = data;
	}

	render() {
		const shell = this.renderShell();
		const widget = shell.querySelector('.widget');

		const oldValue = this.data.oldValue != null ? this.data.oldValue : 0;
		const newCases = this.data.value - oldValue;

		const trend = newCases > 0 ? 1 : newCases == 0 ? 0 : -1;

		const content = `
			<div class="widget-values">
				<span
					class="widget-trend"
					${
						trend > 0
							? `style="color: var(--ui-color-accent-blue)";`
							: trend == 0
							? ''
							: `style="color: var(--ui-color-accent-contrast)";`
					}
					>${this._calculateTrend(trend)}</span
				>
				<span class="widget-cases" style="display: block;"
					>${this.data.value.toString().split('.')[0]}<span style="font-size: 0.3em;">.${
			this.data.value.toString().split('.')[1]
		}%</span></span
				>
			</div>
			<div class="widget-details">
				<span
					class="widget-value-newCases"
					${
						newCases > 0
							? `style="color: var(--ui-color-accent-blue); margin-left: auto;"`
							: `style="color: var(--ui-color-accent-contrast; margin-left: auto;"`
					}
				>
					${
						newCases != undefined
							? `${
									Number.isInteger(newCases)
										? `${
												newCases >= 0
													? `+${newCases}`
													: newCases
										  }`
										: `+${newCases.toFixed(2)}`
							  }%`
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
		if (data.icuOccupation.value > data.icuOccupation.threshold) {
			return 2;
		} else if (
			data.hospitalized7Days.value > data.hospitalized7Days.threshold
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
			widgetTitle: `Krankenhauskapazität (ltz. ${data.length} Tage)`,
			widgetDescription: `Anzahl der Patienten die mit Covid-19 Hospitalisiert & auf der Intensivstation liegen im ${data.length} Tages Verlauf.`,
			widgetSize: 'medium',
			widgetId: 'history',
		});

		this.data = data;
		this.canvasId = '_7daytrend';

		window.addEventListener('resize', (ev) => {
			this._constructLineGraph();
		});
	}

	render() {
		const shell = this.renderShell();
		const widget = shell.querySelector('.widget');

		const content = `<canvas id="${this.canvasId}" ></canvas>`;
		this.wContent = widget.querySelector('.widget-content');
		this.wContent.style =
			'display: inline-block; height: 100%; height: -webkit-fill-available; margin-top: 0.5em;';

		this.wContent.innerHTML = content;
		return widget;
	}
	_constructLineGraph() {
		const canvas = document.querySelector(`#${this.canvasId}`);
		const ctx = canvas.getContext('2d');

		// reset all the canvas sizes

		canvas.style = '';
		canvas.width = canvas.height = 0;

		/*

			Find the size of the surrounding element and set the canvas size

		*/

		const { width, height } = this.wContent.getBoundingClientRect();

		canvas.width = width * 2 * window.devicePixelRatio;
		canvas.height = height * 2 * window.devicePixelRatio;

		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';

		const dates = this.data.map((entry) =>
			entry != null ? entry.meta.dataCurrentAsOf : 0
		);

		/*

			Create useful constants

		*/

		const padding = 40 * window.devicePixelRatio;
		const columnWidth = parseInt(
			(canvas.width - padding * 2) / (dates.length - 1)
		);

		/*

			create the x/y coordinates to go with the data

		*/

		const caseNumbers = 1200;

		const valuesICU = this.parseData(this.data, 'icuOccupation');
		const pointsICU = valuesICU.map((value, index) => {
			return { value, column: index * columnWidth + padding };
		});

		const valuesHospitalization = this.parseData(
			this.data,
			'hospitalized7Days'
		);
		const pointsHospitalization = valuesHospitalization.map(
			(value, index) => {
				return { value, column: index * columnWidth + padding };
			}
		);

		// figuring out how many pixels convert to a case
		const canvasHeight = (canvas.height - padding * 2) / caseNumbers;

		// clear the context

		ctx.clearRect(0, 0, canvas.width, canvas.height);

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

			ctx.font = `42px sans-serif`;
			ctx.textAlign = 'center';

			dates.forEach((date, index) => {
				if (date == 0) {
					return;
				}

				const weekDay = new Date(date).getDay();
				if (weekDay == 0 || weekDay == 6) {
					ctx.fillStyle = 'rgba(255,255,255,0.6)';
				} else {
					ctx.fillStyle = 'rgba(255,255,255,0.3)';
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

			ctx.strokeStyle = 'rgba(255,255,255,1)';

			ctx.moveTo(0 + padding, canvas.height - padding);
			ctx.lineTo(0 + padding, 0 + padding);
			ctx.stroke();

			for (let i = 0; i <= caseNumbers; i = i + 200) {
				ctx.beginPath();
				ctx.strokeStyle =
					i == 600 ? 'rgba(255,0,0,0.5)' : 'rgba(255,255,255,0.2)';

				ctx.setLineDash([5, 20]);

				ctx.moveTo(
					0 + padding,
					canvas.height - padding - canvasHeight * i
				);
				ctx.lineTo(
					canvas.width - padding,
					canvas.height - padding - canvasHeight * i
				);

				// draw y axis labels
				ctx.fillStyle = 'rgba(255,255,255,0.3)';
				ctx.font = '46px sans-serif';
				ctx.textAlign = 'left';
				ctx.fillText(
					i,
					0 + padding + 35,
					canvas.height - padding - canvasHeight * i - 30
				);

				ctx.stroke();
			}
		};

		drawAxis(dates);

		/*
	
				Construct the linegraph
	
		*/

		const drawLinegraph = (points, color) => {
			ctx.beginPath();
			ctx.lineWidth = 5;
			ctx.setLineDash([]);
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
		drawLinegraph(pointsHospitalization, 'rgba(57, 160, 237, 1)');

		const drawLegend = (color, text, y) => {
			const rect = {
				width: 20 * window.devicePixelRatio,
				height: 20 * window.devicePixelRatio,
				get x() {
					return (
						canvas.width -
						padding -
						this.width -
						220 * window.devicePixelRatio
					);
				},
			};

			ctx.clearRect(
				rect.x - 20,
				y - 15,
				300 * window.devicePixelRatio,
				40 * window.devicePixelRatio
			);

			ctx.fillStyle = color;
			ctx.fillRect(rect.x, y, rect.width, rect.height);

			ctx.fillStyle = 'rgba(255,255,255,0.8)';
			ctx.font = '46px sans-serif';
			ctx.textBaseline = 'middle';
			ctx.fillText(
				text,
				rect.x + rect.width + 15,
				y + rect.height / 2,
				250 * window.devicePixelRatio
			);
		};

		drawLegend('rgba(255, 90, 95, 1)', 'Intensivbelegung', 50);
		drawLegend('rgba(57, 160, 237, 1)', 'Hospitalisierungen', 120);
	}
	parseData(data, key) {
		return data.map((entry) => (entry != null ? entry[key].value : 0));
	}
}

export { ValueWidget, TrafficLightWidget, HistoryWidget, VaccWidget };

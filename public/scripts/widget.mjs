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
	constructor({ widgetTitle, widgetDescription, widgetSize }) {
		this._widgetSize = widgetSize;
		this.widgetTitle = widgetTitle;
		this.widgetDescription = widgetDescription;
	}
	renderShell() {
		const string = `
			<div
				class="widget"
				id="${this.widgetTitle.replace(' ', '').toLowerCase()}"
				${this._getGridSize(this._widgetSize)}
			>
				<div class="widget-text">
					<h3 class="widget-title">${this.widgetTitle}</h3>
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
			widgetTitle: 'Intensivbelegung (ltz. 14 Tage)',
			widgetDescription: '',
			widgetSize: 'medium',
		});

		this.data = data;
	}

	render() {
		const shell = this.renderShell();
		const widget = shell.querySelector('.widget');

		const content = `<canvas id="linegraph"></canvas>`;

		widget.querySelector('.widget-content').innerHTML = content;
		return widget;
	}
	_constructLineGraph() {
		const canvas = document.querySelector('#linegraph');
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fillRect(0, 0, 50, 50);
	}
}

export { ValueWidget, TrafficLightWidget, HistoryWidget };

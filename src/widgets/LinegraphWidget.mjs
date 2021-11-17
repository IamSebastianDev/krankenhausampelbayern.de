/** @format */

import { WidgetCore } from './WidgetCore.mjs';
import { padZero } from '../utilities/padZero.mjs';

class LinegraphWidget extends WidgetCore {
	constructor(dataSet, widgetName) {
		super();

		this.dataSet = dataSet.slice(-29, -1);
		this.widgetName = widgetName;

		window.addEventListener('resize', (ev) => {
			this.renderLinegraph();
		});
	}

	renderRemoveButton(preview) {
		const { x } = Pangolicons.icons;

		return !preview
			? `<button class="widget-remove" widget-id="${this.id}">
		${x.toString({ 'stroke-width': 2 })}
	</button>`
			: '';
	}

	render({ preview = false } = {}) {
		const { html } = this;

		const timeframe = this.dataSet.length;

		const [title, ...details] =
			`Krankenhausauslastung der letzten ${timeframe} Tage.`.split(' ');
		const description = `Anzahl der Patienten die mit Covid-19 <span style="color: var(--widget-color-blue)">Hospitalisiert</span> & auf der <span style="color: var(--widget-color-red)">Intensivstation</span> liegen im ${timeframe} Tages Verlauf.`;

		return html`
			<div
				class="widget ${preview ? 'widget-preview' : ''}"
				size="medium"
				widget-id="${this.id}"
				widgetname="${this.widgetName}"
			>
				${this.renderRemoveButton(preview)}
				<div class="widget-top">
					<h3 class="widget-top__title">
						${title}
						<span class="widget-top__detail"
							>${details.join(' ')}</span
						>
					</h3>
					<hr />
					<p class="widget-top__description">${description}</p>
				</div>
				<div class="widget-content">
					<canvas
						class="widget-canvas"
						id="linegraph-${this.id}"
					></canvas>
				</div>
			</div>
		`;
	}

	hasRendered() {
		this.renderLinegraph();
	}

	resetCanvas(canvas) {
		canvas.width = canvas.height = undefined;
		canvas.style = '';
	}

	renderLinegraph() {
		// get the canvas element
		const canvas = document.querySelector(`#linegraph-${this.id}`);

		this.resetCanvas(canvas);

		/**
		 * Gather the necessary sizes to render the Element. To ensure a good fit on all elements indepentend of CSS
		 * Styling, the Element takes up full with and height and the displayable safe zone is calculated from the
		 * actual contet's sizes. The following constants are mostly canvas setups.
		 */

		const { width, height } = canvas.getBoundingClientRect();
		const contentTop = document.querySelector(
			`.widget[widget-id="${this.id}"] .widget-top`
		);

		canvas.width = width * 2;
		canvas.height = height * 2;

		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';

		const padding = 60;
		const paddingTop = 80 + contentTop.getBoundingClientRect().height * 2;

		const ctx = canvas.getContext('2d');

		const canvasSafeWidth = canvas.width - padding * 2;
		const canvasSafeHeight = canvas.height - padding - paddingTop;

		/**
		 * The following constants are used to describe the look of the graph as well as it's paramters
		 */

		const maximumThreshold = 1200;

		const columnWidth = canvasSafeWidth / (this.dataSet.length - 1);
		const valueToPixelRatio = canvasSafeHeight / maximumThreshold;

		const colorICU = `rgba(255, 90, 95, 1)`;
		const colorHOS = `rgba(57, 160, 237, 1)`;

		const dates = this.dataSet.map((entry) => new Date(entry.meta.created));
		const valuesICU = this.dataSet.map(
			(entry) => entry.icuOccupation.value
		);
		const valuesHOS = this.dataSet.map(
			(entry) => entry.hospitalized7Days.value
		);

		const drawLineGraph = (dataPoints, color) => {
			ctx.beginPath();
			ctx.strokeStyle = color;
			ctx.lineWidth = 2;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';

			ctx.moveTo(
				0 + padding,
				canvas.height - dataPoints[0] * valueToPixelRatio - padding
			);

			dataPoints.forEach((point, index) => {
				ctx.lineTo(
					index * columnWidth + padding,
					canvas.height - point * valueToPixelRatio - padding
				);
			});

			ctx.stroke();
		};

		const drawAxis = (dates) => {
			const origin = { x: 0 + padding, y: canvasSafeHeight + paddingTop };

			// style the axis

			ctx.strokeStyle = 'rgba(255,255,255,1)';
			ctx.lineWidth = 1;

			// draw the x axis
			ctx.beginPath();

			ctx.moveTo(origin.x, origin.y);
			ctx.lineTo(canvasSafeWidth + padding, origin.y);

			ctx.stroke();

			// draw the y axis

			ctx.beginPath();

			ctx.moveTo(origin.x, origin.y - 10);
			ctx.lineTo(origin.x, 0 + paddingTop);

			ctx.stroke();

			// set the text properties

			ctx.font = '22px monospace';
			ctx.fillStyle = 'rgba(255,255,255,0.6)';
			ctx.textAlign = 'left';

			// draw the y axis markers

			for (let i = 0; i < maximumThreshold; i++) {
				if (i % 200 === 0) {
					const value = i + 200;

					const xPos = origin.x;
					const yPos = origin.y - value * valueToPixelRatio;

					const { width } = ctx.measureText(
						value.toString().length === 3 ? '0' + value : value
					);

					ctx.beginPath();

					ctx.setLineDash([5, 20]);
					ctx.strokeStyle =
						value === 600 ? colorICU : 'rgba(255,255,255,0.4)';

					ctx.moveTo(xPos + width + 30, yPos);
					ctx.lineTo(xPos + canvasSafeWidth, yPos);
					ctx.stroke();

					ctx.textBaseline = 'middle';

					ctx.fillText(value, xPos + 20, yPos);
				}
			}

			// reset the linedash
			ctx.setLineDash([]);

			dates.forEach((date, index) => {
				const dateString = padZero(
					new Date(date).toLocaleDateString('de-DE')
				);
				const { width } = ctx.measureText(dateString);
				const textPadding = 40;

				// the number of dates to display is equal to the canvasSafeWidth / width + textPadding

				const numberOfDatesToDisplay = Math.floor(
					(this.dataSet.length - 1) /
						Math.round(canvasSafeWidth / (width + textPadding))
				);

				const xPos = padding + index * columnWidth + textPadding / 2;
				const yPos = paddingTop + canvasSafeHeight - 20;

				if (index % numberOfDatesToDisplay === 0) {
					// draw the markers

					ctx.beginPath();

					ctx.strokeStyle = 'rgba(230,230,230,1)';
					ctx.moveTo(xPos - textPadding / 2, yPos + 20 - 10);
					ctx.lineTo(xPos - textPadding / 2, yPos + 20 + 10);

					ctx.stroke();

					// return early if the text runs out of bound

					if (
						xPos + width - textPadding / 2 >
						canvasSafeWidth + padding
					) {
						return;
					} else {
						ctx.textAlign = 'left';
						ctx.fillText(dateString, xPos, yPos);
					}
				}
			});
		};

		drawLineGraph(valuesICU, colorICU);
		drawLineGraph(valuesHOS, colorHOS);
		drawAxis(dates);
	}
}

export { LinegraphWidget };

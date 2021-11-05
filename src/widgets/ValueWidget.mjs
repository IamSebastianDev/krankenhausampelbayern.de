/** @format */

import { WidgetCore } from './WidgetCore.mjs';

class ValueWidget extends WidgetCore {
	constructor(dataSet, widgetName) {
		super();

		this.dataSet = dataSet;
		this.widgetName = widgetName;
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
		const html = this.html;

		const [title, ...details] = this.dataSet.title.split(' ');
		const { description, value, lastValue, threshold, unit } = this.dataSet;

		return html`
			<div
				class="widget ${preview ? 'widget-preview' : ''}"
				size="small"
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
					<div class="widget-content__trend">
						${this.renderTrend(value, lastValue)}
						${this.renderValue(value, threshold, unit)}
					</div>
					<div class="widget-content__details">
						${this.renderDetails({
							value,
							lastValue,
							threshold,
							unit,
						})}
					</div>
				</div>
			</div>
		`;
	}
}

export { ValueWidget };

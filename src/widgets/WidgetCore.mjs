/** @format */

import CreateUUID from '../utilities/CreateUUID';

const Parser = new DOMParser();

class WidgetCore {
	constructor() {
		this.id = CreateUUID();
		this._selector = `.widget[widget-id='${this.id}']`;
	}

	renderValue(value, threshold, unit) {
		const html = this.html;

		const [valueStr, decimal] = value.toString().split('.');

		let color = 'var(--widget-color-light)';
		if (threshold) {
			color =
				value > threshold
					? 'var(--widget-color-red)'
					: 'var(--widget-color-blue)';
		}

		// hacky fix for the introduced threshold value of 450 in the icuOccupation value.

		if (threshold === 600 && value > 450 && value < 600) {
			color = 'var(--widget-color-yellow)';
		}

		const fontSize = valueStr.length > 3 ? '3.5em' : '5em';

		return html`<h3
			class="widget-content__trend-value"
			style="color: ${color};  margin-left: auto; font-size: ${fontSize};"
		>
			${valueStr}<span class="widget-content__trend-decimal"
				>${decimal ? '.' + decimal : ''}${this.renderUnit(unit)}</span
			>
		</h3>`;
	}

	invertScheme(inverted) {
		return inverted
			? ['var(--widget-color-blue)', 'var(--widget-color-red)']
			: ['var(--widget-color-red)', 'var(--widget-color-blue)'];
	}

	renderTrend(value, lastValue) {
		const html = this.html;

		const { arrowRight, arrowRightUp, arrowRightDown } = Pangolicons.icons;
		const iconConfig = { 'stroke-width': 2, width: '8em', height: '8em' };
		const colourScheme =
			this.widgetName === 'vaccination'
				? this.invertScheme(true)
				: this.invertScheme(false);

		const icon =
			value > lastValue
				? arrowRightUp.toString({
						...iconConfig,
						stroke: colourScheme[0],
				  })
				: value === lastValue
				? arrowRight.toString({
						...iconConfig,
						stroke: 'var(--widget-color-light)',
				  })
				: arrowRightDown.toString({
						...iconConfig,
						stroke: colourScheme[1],
				  });

		return html`<span class="widget-content__trend-indicator">
			${icon}
		</span>`;
	}

	renderUnit(unit) {
		if (unit === null || unit === 'Fälle' || unit === undefined) {
			return '';
		}

		return unit;
	}

	renderDetails({ value, lastValue, threshold, unit }) {
		return `${this.renderDifference(value, lastValue, unit)}
			${threshold ? this.renderPecentage(value, threshold) : ''}
			${threshold ? this.renderTreshold(value, threshold) : ''}
			`;
	}

	renderTreshold(value, threshold) {
		const color =
			value > threshold
				? 'var(--widget-color-red)'
				: 'var(--widget-color-light)';

		return `<span
			class="widget-details__threshold"
			style="color: ${color}"
			>${value} / ${threshold}</span
		>`;
	}

	renderPecentage(value, threshold) {
		const percentage = ((100 * value) / threshold).toFixed(2);

		return `<span class="widget-details__percentage">
			(${percentage}%)
		</span>`;
	}

	renderDifference(value, lastValue, unit) {
		const difference = value - lastValue;

		const colourScheme =
			this.widgetName === 'vaccination'
				? this.invertScheme(true)
				: this.invertScheme(false);

		const color =
			value > lastValue
				? colourScheme[0]
				: value < lastValue
				? colourScheme[1]
				: 'var(--widget-color-light)';

		return `<span class="widget-details__difference" style="color: ${color}">${
			difference < 0 ? '' : '+'
		} ${
			Number.isInteger(difference) ? difference : difference.toFixed(2)
		} ${this.renderUnit(unit)}</span>`;
	}

	html(strings, ...props) {
		// a temporary array to hold the created placeholder references

		const placeholder = {};

		/**
		 * Map the strings together with their respective props, replacing documentFragments created with for example
		 * this method with a reference value to later replace with the actual document fragment.
		 * The way a tagged template literal works, their will always be 1 string more then props, that is simply
		 * returned.
		 */

		const template = strings
			.map((str, index) => {
				if (index < strings.length - 1) {
					if (props[index] instanceof DocumentFragment) {
						// if the prop is a document Fragment, push the fragment to the placeholderqueue
						const UUID = CreateUUID();

						placeholder[UUID] = {
							frag: props[index],
						};

						return `${str}<placeholder index="${UUID}"></placeholder>`;
					} else {
						return str + props[index];
					}
				} else {
					return str;
				}
			})
			.join('');

		// parse the template into a document

		const doc = Parser.parseFromString(template, 'text/html').querySelector(
			'body'
		);

		// replace the placeholder elements with their respective reference document fragment

		[...doc.querySelectorAll('placeholder')].forEach((element) => {
			element.replaceWith(
				placeholder[element.getAttribute('index')].frag
			);
		});

		// create a new fragment and append the created document.

		const frag = new DocumentFragment();
		frag.appendChild(...doc.childNodes);

		// return the fragment
		return frag;
	}
}

export { WidgetCore };

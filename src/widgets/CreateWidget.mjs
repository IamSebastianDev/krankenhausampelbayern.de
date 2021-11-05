/** @format */

// import { WidgetPresenter } from '../app.mjs';
import { WidgetCore } from './WidgetCore.mjs';

class CreateWidget extends WidgetCore {
	constructor(listOfWidgets) {
		super();

		this.listOfWidgets = listOfWidgets;
	}

	render() {
		const html = this.html;

		return html`
			<button class="widget-creator" widget-id="${this.id}">
				${Pangolicons.icons.plus.toString({
					'stroke-width': '2',
				})}
			</button>
		`;
	}
}

export { CreateWidget };

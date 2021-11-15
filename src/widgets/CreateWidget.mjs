/** @format */

// import { WidgetPresenter } from '../app.mjs';
import { WidgetCore } from './WidgetCore.mjs';

class CreateWidget extends WidgetCore {
	constructor({ noWidgetsLeft }) {
		super();

		this.showButton = !noWidgetsLeft;
	}

	render() {
		const html = this.html;

		return html`
			<button
				class="widget-creator"
				widget-id="${this.id}"
				${!this.showButton ? 'style="display: none"' : ''}
			>
				${Pangolicons.icons.plus.toString({
					'stroke-width': '2',
				})}
			</button>
		`;
	}
}

export { CreateWidget };

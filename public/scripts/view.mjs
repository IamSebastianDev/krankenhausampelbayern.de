/** @format */

// create a DOMParser instance to parse HTMLStrings created by the views into DOMnodes

const Parser = new DOMParser();
const parseHTML = (string) => Parser.parseFromString(string, 'text/html');

class Controller {
	constructor({ dataCategories, target }) {}

	presentList() {}

	renderLayout() {}

	// methods to store and retrive the user created layout

	retrieveLayout() {}
	saveLayout() {}
}

export { Controller };

class View {
	constructor({ title = '', description = '', size = 'small' }) {
		this._id = `_${Date.now()}`;

		this.size = size;
		this.title = title;
		this.description = description;
	}

	// the shell is the static part of the view

	renderShell() {
		// prepare the title by splitting it into main and detail part

		const [title, ...detail] = this.title;

		// create the shell html String

		const shell = `
		<div class="view ${this._gridSize}" id="${this._id}">
			<div class="view-text">
				<h3 class="view-title">
					${title}
					<span class="view-title-details">${detail.join(' ')}</span>
				</h3>
				<hr />
				<p class="view-description">${this.description}</p>
			</div>
			<div class="view-content"></div>
		</div>`;

		return parseHTML(shell).querySelector('.view');
	}

	get _gridSize() {
		switch (this.size) {
			default:
			case 'small':
				return `view-small`;
			case 'medium':
				return `view-medium`;
			case 'large':
				return `view-large`;
		}
	}
}

class SimpleView extends View {
	constructor({ title = '', description = '' } = {}) {
		super({ title, description });
	}

	render() {
		const shell = this.renderShell();
	}

	hydrateView(data) {}
}

export { SimpleView };

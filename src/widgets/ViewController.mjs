/** @format */

import { ValueWidget } from './ValueWidget.mjs';
import { TrafficLight } from './TrafficLight.mjs';
import { CreateWidget } from './CreateWidget.mjs';

/**
 * @description The ViewController class is used to control the widget section of the Webpage. It contains methods
 * to store & retrieve the layout of the view, as well as create new widgets or remove them.
 */

class ViewController {
	constructor({ targetElement }) {
		// the target element is the element the widgets will be rendered to.

		this._targetElement = targetElement;

		// the default layout is the layout that will be rendered when no layout can be retrieved from the local storage

		this._defaultLayout = [
			'hospitalizedIncidence',
			'hospitalized7Days',
			'icuOccupation',
		];

		// the layout Property holds the name of all widgets to be displayed

		this._layout = [];

		// the widgetlist property holds all widget's that can be created by name

		this.widgetList = [];

		// add the event listener for adding and removing widgets from the list

		window.addEventListener('click', (ev) => {
			if (ev.target.closest('.widget-remove')) {
				const id = ev.target
					.closest('.widget-remove')
					.getAttribute('widget-id');

				this._view = this._view.filter((widget) => widget.id !== id);

				this.renderLayout();
			}
		});

		window.addEventListener('DOMContentLoaded', (ev) => {
			this.retrieveLayout();
		});
	}

	// the method is used to import the data into the created view controller. This will then also create the list of widget's that can be created as well as initiate the first render of the widgets

	injectData(dataSet) {
		// internalize the data

		this._dataSet = dataSet;
		this._lastData = dataSet[dataSet.length - 1];

		// generate the list of widgets that can be created

		this.generateWidgetList();

		this.renderLayout();
	}

	generateWidgetList() {
		// itterate over the provided data and push them to the widget list.

		for (const point in this._lastData) {
			if (Object.hasOwnProperty.call(this._lastData, point)) {
				const data = this._lastData[point];

				if (point !== 'meta' && point !== '_id') {
					const { title, description } = data;

					this.widgetList.push({
						title,
						description,
						data,
						widgetName: point,
						widgetType: ValueWidget,
					});
				}
			}
		}

		// @todo sort the created list alphabetically
	}

	addWidgetToView(widgetName) {
		const widget = this.widgetList.find(
			(elem) => elem.widgetName === widgetName
		);

		this._view = [
			...this._view,
			new widget.widgetType(widget.data, widget.widgetName),
		];

		this.renderLayout();
	}

	// the createLayout method used creates the layout according to the provided array of strings

	createView(layout) {
		this._view = layout.map((name) => {
			const widgetClass = this.widgetList.find(
				(elem) => elem.widgetName == name
			);

			if (widgetClass === undefined) {
				return;
			}

			return new widgetClass.widgetType(
				widgetClass.data,
				widgetClass.widgetName
			);
		});

		this._view = this._view.filter((elem) => elem != undefined);
	}

	getListOfWidget() {
		return this.widgetList;
	}

	renderLayout() {
		/**
		 * @todo: Change the layout reset to a morph, by itterating over the elements, and replacing them if
		 * the instance id is not equal, and removing or adding elements if the length has changed.
		 */

		this._view === undefined && this.createView(this._layout);

		// reset the layout
		[...this._targetElement.childNodes].forEach((node) => node.remove());

		// itterate over the layout and render the widgetInstances to the target
		[
			new TrafficLight(this._dataSet),
			...this._view,
			new CreateWidget(),
		].forEach((widget) => {
			this._targetElement.appendChild(widget.render());
		});

		this.saveLayout();
	}

	// methods to store and retrive the user created layout

	retrieveLayout() {
		const layoutList = JSON.parse(localStorage.getItem('layout'));

		this.currentLayout = layoutList ? layoutList : this._defaultLayout;
	}

	saveLayout() {
		localStorage.setItem('layout', JSON.stringify(this.currentLayout));
	}

	get currentLayout() {
		return this._view.map((widget) => widget.widgetName);
	}

	set currentLayout(layout) {
		this._layout = layout;

		// this.renderLayout();
	}
}

export { ViewController };

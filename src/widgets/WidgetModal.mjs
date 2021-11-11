/** @format */

// the Widget presenter is a Modal that is

class WidgetModal {
	constructor({ target, Controller }) {
		this.target = target;
		this.controller = Controller;
		this.slider = target.querySelector('.widget-modal__slider');

		window.addEventListener('click', (ev) => {
			ev.target.closest(`.widget-creator`) && this.open();
			ev.target.closest('.widget-modal__close') && this.close();

			ev.target.closest(`.widget-modal__controls-button[increase]`) &&
				this.moveRight();
			ev.target.closest(`.widget-modal__controls-button[decrease]`) &&
				this.moveLeft();

			if (ev.target.closest('.widget-preview__inFocus')) {
				const widgetName = ev.target
					.closest('.widget-preview')
					.getAttribute('widgetname');

				if (widgetName !== null) {
					this.controller.addWidgetToView(widgetName);
					this.close();
				}
			}
		});

		this.index = 0;
		this.state = false;

		window.addEventListener('touchstart', (ev) => {
			this.state && this.handleTouchEvent(ev);
		});

		window.addEventListener('touchend', (ev) => {
			this.state && this.handleTouchEvent(ev);
		});
	}

	handleTouchEvent(ev) {
		if (ev.type == 'touchstart') {
			this.start = ev.pageX;
		}

		if (ev.type == 'touchend') {
			this.end = ev.pageX;
		}

		if (this.start && this.end) {
			// check if the start and end are equal, indicating a touch instead of a drag
			if (
				this.start === this.end &&
				ev.target.closest('.widget-preview__inFocus')
			) {
				const widgetName = ev.target
					.closest('.widget-preview')
					.getAttribute('widgetname');

				if (widgetName !== null) {
					this.controller.addWidgetToView(widgetName);
					this.close();
				}
			}

			this.start + window.innerWidth * 0.2 > this.end && this.moveRight();
			this.start - window.innerWidth * 0.2 < this.end && this.moveLeft();
			this.start = undefined;
			this.end = undefined;
		}
	}

	renderModalList() {
		const widgets = this.controller.getListOfWidget();

		this.widgetList = widgets.filter(
			(widget) =>
				![...document.querySelector('#data-widgets').childNodes]
					.filter((node) => node.nodeType !== 3)
					.map((node) => node.getAttribute('widgetname'))
					.includes(widget.widgetName)
		);

		const { widgetList } = this;

		if (widgetList.length === 0) {
			return;
		}

		widgetList.forEach((widget) => {
			const slideContainer = document.createElement('div');
			slideContainer.className = `widget-modal__slide-container`;

			const createdWidget = new widget.widgetType(
				widget.data,
				widget.widgetName
			);
			slideContainer.appendChild(createdWidget.render({ preview: true }));
			this.slider.appendChild(slideContainer);
			createdWidget.hasRendered();
		});
	}

	open() {
		this.state = true;
		this.target.setAttribute('visible', '');
		document.querySelector('body').style.overflow = 'hidden';

		this.renderModalList();

		this.moveTo();
	}
	close() {
		this.state = false;
		this.index = 0;
		this.target.removeAttribute('visible');
		document.querySelector('body').style = '';

		[...this.slider.childNodes].forEach((node) => node.remove());
	}

	moveRight() {
		const { length } = this.widgetList;

		this.index = this.index == length - 1 ? 0 : this.index + 1;
		this.moveTo();
	}
	moveLeft() {
		const { length } = this.widgetList;

		this.index = this.index == 0 ? length - 1 : this.index - 1;
		this.moveTo();
	}

	moveTo() {
		// the following function will check all widths of elements and will return the most prevelant witdh of the elements

		const mode = (myArray) =>
			myArray.reduce(
				(a, b, i, arr) =>
					arr.filter((v) => v === a).length >=
					arr.filter((v) => v === b).length
						? a
						: b,
				null
			);

		const width = mode(
			[...this.slider.childNodes].map(
				(node) => node.getBoundingClientRect().width
			)
		);

		const scaleFactor = width === window.innerWidth ? 0 : width * 0.5;

		// get the child element to focus on

		const [...childNodes] = this.slider.childNodes;
		childNodes.forEach((node, index) => {
			node.classList.add('widget-preview__outFocus');
			index === this.index &&
				node.classList.replace(
					'widget-preview__outFocus',
					'widget-preview__inFocus'
				);
		});

		const widget = this.widgetList[this.index] || {
			title: 'Keine weiteren Widgets verfügbar',
		};

		document.querySelector(
			'.widget-modal__controls-description'
		).textContent = widget.title;

		const getSlidePostion = () => width * this.index - scaleFactor;

		this.slider.style.transform = `translateX(${getSlidePostion() * -1}px)`;
	}
}

export { WidgetModal };

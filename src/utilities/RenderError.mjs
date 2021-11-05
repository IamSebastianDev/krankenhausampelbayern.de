/** @format */

/**
 *
 * @param { String } error - The Error that has been reported and will be logged to the target.
 * @param { HTMLElement } target - The Element that the error Element will be attached to.
 *
 * @description A method that can be used to render an Error to a target Element. The Error has it's own remove Method
 * to remove the Element once the error has been ackknowleged
 */

const RenderError = (error, target) => {
	// create the error element

	const container = document.createElement('span');
	container.className = 'message-error';

	const message = document.createElement('p');
	message.textContent = `Fehler: ${error}`;

	const close = document.createElement('button');
	close.className = 'message-close';
	close.innerHTML = Pangolicons.icons.x.toString({ 'stroke-width': '1.5' });

	// add a click event listener to the Element to remove it.

	close.addEventListener('click', (ev) => {
		container.remove();
	});

	container.appendChild(message);
	container.appendChild(close);

	target.appendChild(container);
};

export { RenderError };

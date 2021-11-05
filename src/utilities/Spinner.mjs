/** @format */

const Spinner = document.querySelector('#spinner');

Spinner.complete = () => {
	Spinner.style = 'transform: scale(1.2); opacity: 0';
	window.setTimeout(() => {
		Spinner.style.display = 'none';
	}, 1000);
};

export { Spinner };

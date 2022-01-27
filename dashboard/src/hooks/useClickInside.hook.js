/** @format */

import { useEffect } from 'react';

export const useClickInside = (ref, callback) => {
	const handler = (ev) => {
		if (ref.current && ref.current.contains(ev.target)) {
			callback(ev);
		}
	};

	useEffect(() => {
		window.addEventListener('click', handler);

		return () => {
			window.removeEventListener('click', handler);
		};
	});
};

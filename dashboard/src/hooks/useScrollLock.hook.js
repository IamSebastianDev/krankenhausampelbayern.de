/** @format */

import { useState } from 'react';

export const useScrollLock = () => {
	const [locked, setLock] = useState(false);
	document.body.style.overflowY = locked ? 'hidden' : 'auto';
	return [setLock];
};

/** @format */

import React, { useState, useEffect } from 'react';
import { InternalLink } from '../Navigation/InternalLink';
import { ExternalLink } from '../Navigation/ExternalLink';
import { MoonRough, X } from 'react-pangolicons';
import { joinClassNames as cls } from '../../scripts/joinClassNames.util';

export const PrivacyModal = () => {
	const [modalState, setModalState] = useState(false);
	useEffect(() => {
		if (localStorage.getItem('cookie-seen')) {
			setModalState(!localStorage.getItem('cookie-seen'));
			return;
		}

		setModalState(true);
	});

	const hideModal = () => {
		setModalState(false);
		localStorage.setItem('cookie-seen', true);
	};

	return (
		<div
			className={cls(
				'fixed bottom-0 right-0 m-4 py-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-slate-600 dark:text-slate-400 flex transform duration-200 ease-in-out flex-row max-w-screen-md shadow-md',
				modalState ? 'translate-y-0' : 'translate-y-40'
			)}>
			<MoonRough className="flex-shrink-0 block w-auto px-2 mx-2 self-center" />
			<p>
				Hey! Diese Website benutzt Javascript und den{' '}
				<ExternalLink
					className="dark:text-white text-zinc-900 hover:underline"
					href="https://de.wikipedia.org/wiki/Web_Storage#Lokale_Speicherung">
					Lokalen Speicher
				</ExternalLink>{' '}
				deines Webbrowsers sowie manchmal Cookies um zu funtkionieren.
				Du kannst mehr über deren Funktion in der{' '}
				<InternalLink
					className="dark:text-white text-zinc-900 hover:underline"
					to="/legal">
					Privacy Policy
				</InternalLink>{' '}
				erfahren.
			</p>
			<button
				title="Cookiebanner schließen."
				onClick={hideModal}
				className="flex flex-col justify-center items-center ml-3 px-3 border-l border-l-zinc-500 flex-shrink-0 hover:text-blue-500">
				<X />
			</button>
		</div>
	);
};

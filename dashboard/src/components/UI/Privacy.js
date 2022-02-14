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
				'fixed bottom-0 right-0 z-50 m-4 flex max-w-screen-md transform flex-row border border-zinc-300 bg-zinc-100 py-4 text-slate-600 shadow-md duration-200 ease-in-out dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-400',
				modalState ? 'translate-y-0' : 'translate-y-[150%]'
			)}>
			<MoonRough className="mx-2 block w-auto flex-shrink-0 self-center px-2" />
			<p>
				Hey! Diese Website benutzt Javascript und den{' '}
				<ExternalLink
					className="text-zinc-900 hover:underline dark:text-white"
					href="https://de.wikipedia.org/wiki/Web_Storage#Lokale_Speicherung">
					Lokalen Speicher
				</ExternalLink>{' '}
				deines Webbrowsers sowie manchmal Cookies um zu funtkionieren.
				Du kannst mehr über deren Funktion in der{' '}
				<InternalLink
					className="text-zinc-900 hover:underline dark:text-white"
					to="/legal">
					Privacy Policy
				</InternalLink>{' '}
				erfahren.
			</p>
			<button
				title="Cookiebanner schließen."
				onClick={hideModal}
				className="ml-3 flex flex-shrink-0 flex-col items-center justify-center border-l border-l-zinc-500 px-3 hover:text-blue-500">
				<X />
			</button>
		</div>
	);
};

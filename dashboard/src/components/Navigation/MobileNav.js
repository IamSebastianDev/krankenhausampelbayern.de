/** @format */

import React, { useRef } from 'react';
import { useClickInside } from '../../hooks/useClickInside.hook.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.hook';
import { joinClassNames as cls } from '../../scripts/joinClassNames.util.js';

import { InternalLink } from './InternalLink';
import { ExternalLink } from './ExternalLink';

export const MobileNav = ({ toggleNav, showNav }) => {
	/**
	 * @todo: ref targets the ul instead of the link itself. The nav should only close if a link was clicked 
	 * successfully.
	 */

	const prefersReducedMotion = useReducedMotion();
	const navRef = useRef();
	useClickInside(navRef, toggleNav, 'a');

	return (
		<nav
			className={cls(
				'fixed top-0 left-0 w-screen h-screen dark:bg-zinc-900 bg-zinc-200 flex flex-col justify-center items-center text-4xl transform  -z-10 md:hidden duration-700 ease-in-out',
				showNav
					? 'translate-y-0 opacity-100'
					: '-translate-y-full opacity-0',
				prefersReducedMotion
					? 'transition-opacity'
					: 'transition-transopaque'
			)}>
			<ul
				ref={navRef}
				className="flex flex-col justify-between items-center h-1/3">
				<InternalLink to="/">Dashboard</InternalLink>
				<InternalLink to="/interface">API</InternalLink>
				<ExternalLink href="https://github.com/iamsebastiandev/krankenhausampelbayern.de/widget">
					Widget <span className="text-sm self-end">für iOs</span>
				</ExternalLink>
			</ul>
		</nav>
	);
};

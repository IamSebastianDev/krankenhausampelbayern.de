/** @format */

import React, { useRef } from 'react';
import { useClickInside } from '../../hooks/useClickInside.hook.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.hook';
import { joinClassNames as cls } from '../../scripts/joinClassNames.util.js';

import { InternalLink } from './InternalLink';
import { ExternalLink } from './ExternalLink';
import { NavItem } from './NavItem.js';

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
				'fixed top-0 left-0 -z-10 flex h-screen w-screen transform flex-col items-center justify-center bg-zinc-200 text-4xl  duration-700 ease-in-out dark:bg-zinc-900 md:hidden',
				showNav
					? 'translate-y-0 opacity-100'
					: '-translate-y-full opacity-0',
				prefersReducedMotion
					? 'transition-opacity'
					: 'transition-transopaque'
			)}>
			<ul
				ref={navRef}
				className="flex h-1/3 flex-col items-center justify-center">
				<NavItem>
					<InternalLink className="py-8" to="/">
						Dashboard
					</InternalLink>
				</NavItem>
				<NavItem className="py-8">
					<ExternalLink href="https://github.com/iamsebastiandev/krankenhausampelbayern.de/">
						API
					</ExternalLink>
				</NavItem>
				<NavItem>
					<ExternalLink
						className="py-8"
						href="https://github.com/IamSebastianDev/Covid-19-Widget">
						Widget <span className="self-end text-xs">für iOs</span>
					</ExternalLink>
				</NavItem>
			</ul>
		</nav>
	);
};

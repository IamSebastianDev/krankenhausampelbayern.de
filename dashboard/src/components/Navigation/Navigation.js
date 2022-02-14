/** @format */

import { useState } from 'react';

import { Github, X, Menu } from 'react-pangolicons';

import { NavItem } from './NavItem';
import { ExternalLink } from './ExternalLink';
import { InternalLink } from './InternalLink';
import { ThemeSelector } from './ThemeSelector';
import { MobileNav } from './MobileNav';

export const Navigation = () => {
	const [showNav, setShowNav] = useState(false);
	const toggleNav = () => setShowNav((s) => !s);
	const navIcon = [
		<X size={20} className="stroke-2 dark:stroke-1" />,
		<Menu size={20} className="stroke-2 dark:stroke-1" />,
	];

	return (
		<nav className="font-nunito fixed top-0 z-50 w-screen border-b border-b-zinc-300 bg-zinc-100 text-lg font-bold  tracking-wide text-zinc-700 shadow dark:border-b-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
			<ul className="relative z-20 mx-auto flex w-full max-w-screen-xl flex-row px-2 py-4 xl:px-0">
				<NavItem className="mr-auto">
					<InternalLink to="/">🚦 Covid-19 Bayern</InternalLink>
				</NavItem>
				<NavItem className="hidden md:flex">
					<InternalLink to="/">Dashboard</InternalLink>
				</NavItem>
				<NavItem className="hidden md:flex">
					<ExternalLink href="https://github.com/iamsebastiandev/krankenhausampelbayern.de/">
						API
					</ExternalLink>
				</NavItem>
				<NavItem className="hidden md:flex">
					<ExternalLink href="https://github.com/IamSebastianDev/Covid-19-Widget">
						Widget <span className="self-end text-xs">für iOs</span>
					</ExternalLink>
				</NavItem>
				<li className="mx-2  flex flex-row items-center justify-center px-1 hover:text-blue-500 md:hidden">
					<button onClick={toggleNav}>
						{navIcon[showNav ? 0 : 1]}
					</button>
				</li>
				<li className="mx-2 border-l border-l-zinc-300 dark:border-l-zinc-700"></li>
				<ThemeSelector />
				<NavItem>
					<ExternalLink
						href="https://github.com/iamsebastiandev/krankenhausampelbayern.de"
						rel="noreferrer noopener"
						title="Github"
						target="_blank">
						<Github size={20} className="stroke-2 dark:stroke-1" />
					</ExternalLink>
				</NavItem>
			</ul>
			<MobileNav toggleNav={toggleNav} showNav={showNav} />
		</nav>
	);
};

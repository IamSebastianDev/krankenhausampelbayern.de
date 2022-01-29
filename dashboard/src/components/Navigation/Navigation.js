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
		<X size={20} className="dark:stroke-1 stroke-2" />,
		<Menu size={20} className="dark:stroke-1 stroke-2" />,
	];

	return (
		<nav className="fixed top-0 w-screen bg-zinc-100 dark:bg-zinc-900 shadow border-b border-b-zinc-300 dark:border-b-zinc-700 dark:text-zinc-100  text-zinc-700 font-nunito text-lg tracking-wide z-50 font-bold">
			<ul className="relative w-full max-w-screen-xl flex flex-row px-2 xl:px-0 py-4 mx-auto z-20">
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
						Widget <span className="text-xs self-end">für iOs</span>
					</ExternalLink>
				</NavItem>
				<li className="hover:text-blue-500  px-1 mx-2 flex md:hidden flex-row justify-center items-center">
					<button onClick={toggleNav}>
						{navIcon[showNav ? 0 : 1]}
					</button>
				</li>
				<li className="border-l border-l-zinc-300 dark:border-l-zinc-700 mx-2"></li>
				<ThemeSelector />
				<NavItem>
					<ExternalLink
						href="https://github.com/iamsebastiandev/krankenhausampelbayern.de"
						rel="noreferrer noopener"
						title="Github"
						target="_blank">
						<Github size={20} className="dark:stroke-1 stroke-2" />
					</ExternalLink>
				</NavItem>
			</ul>
			<MobileNav toggleNav={toggleNav} showNav={showNav} />
		</nav>
	);
};

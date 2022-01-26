/** @format */

import React, { useContext, useState } from 'react';

import { NavLink } from './NavLink';
import { NavButton } from './NavButton';
import { Github, SunBig, MoonStylized, Menu } from 'react-pangolicons';
import { ThemeModal } from './ThemeModal';
import { ThemeCtx } from '../../store/theme.context';

export const Navigation = () => {
	const { theme } = useContext(ThemeCtx);
	
	const [showThemeModal, setShowThemeModal] = useState(false);
	const toggleThemeModal = () => {
		setShowThemeModal((curState) => !curState);
	};

	return (
		<nav className="fixed w-screen dark:bg-zinc-900 shadow border-b border-b-zinc-300 dark:border-b-zinc-700 font-nunito text-lg tracking-wide">
			<ul className="relative w-full max-w-screen-xl flex flex-row px-2 xl:px-0 py-4 mx-auto dark:text-zinc-100  text-zinc-700 font-bold">
				<NavLink className="mr-auto">🚦 Covid-19 Bayern</NavLink>
				<NavLink
					className="hidden sm:block"
					href="https://github.com/iamsebastiandev/krankenhausampelbayern.de/widget">
					Dashboard
				</NavLink>
				<NavLink
					className="hidden sm:block"
					href="https://github.com/iamsebastiandev/krankenhausampelbayern.de/widget">
					API
				</NavLink>
				<NavLink
					className="hidden sm:block"
					href="https://github.com/iamsebastiandev/krankenhausampelbayern.de/widget">
					Widget <span className="text-xs self-end">für iOs</span>
				</NavLink>
				<NavButton className="sm:hidden">
					<Menu size={20} className="dark:stroke-1 stroke-2" />
				</NavButton>
				<li className="border-l border-l-zinc-300 dark:border-l-zinc-700 mx-2"></li>
				<NavButton onClick={toggleThemeModal}>
					{theme === 'dark' ? (
						<SunBig size={20} className="dark:stroke-1 stroke-2" />
					) : (
						<MoonStylized
							size={20}
							className="dark:stroke-1 stroke-2"
						/>
					)}
				</NavButton>
				<NavLink
					href="https://github.com/iamsebastiandev/krankenhausampelbayern.de"
					rel="noreferrer noopener"
					title="Github"
					target="_blank">
					<Github size={20} className="dark:stroke-1 stroke-2" />
				</NavLink>
			</ul>
			{showThemeModal && <ThemeModal toggleModal={toggleThemeModal} />}
		</nav>
	);
};

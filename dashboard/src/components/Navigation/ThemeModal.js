/** @format */

import React, { useState, useContext, useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside.hook';
import { ThemeCtx } from '../../store/theme.context';

import { SunBig, MoonStylized as Moon, Display } from 'react-pangolicons';
import { joinClassNames as cls } from '../../scripts/joinClassNames.util';

export const ThemeModal = ({ toggleModal }) => {
	const { theme, setTheme, systemDefault } = useContext(ThemeCtx);

	const themeChangeHandler = (theme) => {
		toggleModal();
		setTheme(theme);
	};

	const themeModalRef = useRef();
	useClickOutside(themeModalRef, toggleModal);

	const selectors = [
		{
			onClick: () => themeChangeHandler('dark'),
			name: 'Dark',
			title: 'Change the colour theme to dark.',
			icon: <Moon size={16} className="dark:stroke-1 stroke-2 mr-2" />,
		},
		{
			onClick: () => themeChangeHandler('light'),
			name: 'Light',
			title: 'Change the colour theme to light.',
			icon: <SunBig size={16} className="dark:stroke-1 stroke-2 mr-2" />,
		},
		{
			onClick: () => themeChangeHandler('system'),
			name: 'System',
			title: 'Change the colour theme to the system default.',
			icon: <Display size={16} className="dark:stroke-1 stroke-2 mr-2" />,
		},
	];

	const isActive = ({ name, systemDefault }) =>
		(theme === name.toLowerCase() && !systemDefault) ||
		(name.toLowerCase() === 'system' && systemDefault);

	return (
		<ul
			ref={themeModalRef}
			className="absolute  right-2 border border-zinc-300 dark:border-zinc-700 overflow-hidden bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 text-zinc-700 rounded-md flex flex-col shadow tracking-wide mt-48">
			{selectors.map(({ onClick, name, title, icon }, index) => (
				<li key={index}>
					<button
						onClick={onClick}
						title={title}
						className={cls(
							'flex flex-row justify-start items-center  min-w-[10rem] px-3 py-1 hover:dark:bg-zinc-800 hover:bg-zinc-300 font-semibold select-none',
							isActive({ name, systemDefault })
								? 'text-blue-500'
								: 'text-inherit'
						)}>
						{icon} {name}
					</button>
				</li>
			))}
		</ul>
	);
};

/** @format */

import React, { useState, useContext } from 'react';
import { ThemeCtx } from '../../store/theme.context';

import { SunBig, MoonStylized, Display } from 'react-pangolicons';
import { joinClassNames as cls } from '../../scripts/joinClassNames.util';

export const ThemeModal = ({ toggleModal }) => {
	const { theme, changeTheme } = useContext(ThemeCtx);

	const themeChangeHandler = (theme) => {
		toggleModal();
		changeTheme(theme);
	};

	return (
		<ul className="absolute right-0 mt-2 mr-4 xl:mr-[6%] border border-zinc-300 dark:border-zinc-700 overflow-hidden dark:bg-zinc-900 dark:text-zinc-100 text-zinc-700 rounded-md flex flex-col shadow tracking-wide">
			<li>
				<button
					onClick={() => themeChangeHandler('dark')}
					className={cls(
						'flex flex-row justify-start items-center  min-w-[10rem] px-3 py-1 hover:dark:bg-zinc-800 hover:bg-zinc-300 font-semibold',
						theme === 'dark' ? 'text-blue-500' : 'text-inherit'
					)}>
					<MoonStylized
						size={20}
						className="dark:stroke-1 stroke-2 mr-2"
					/>{' '}
					Dark
				</button>
			</li>
			<li>
				<button
					onClick={() => themeChangeHandler('light')}
					className={cls(
						'flex flex-row justify-start items-center  min-w-[10rem] px-3 py-1 hover:dark:bg-zinc-800 hover:bg-zinc-300 font-semibold',
						theme === 'light' ? 'text-blue-500' : 'text-inherit'
					)}>
					<SunBig size={20} className="dark:stroke-1 stroke-2 mr-2" />{' '}
					Light
				</button>
			</li>
			<li>
				<button
					onClick={() => themeChangeHandler('system')}
					className={cls(
						'flex flex-row justify-start items-center  min-w-[10rem] px-3 py-1 hover:dark:bg-zinc-800 hover:bg-zinc-300 font-semibold',
						theme === 'system' ? 'text-blue-500' : 'text-inherit'
					)}>
					<Display
						size={20}
						className="dark:stroke-1 stroke-2 mr-2"
					/>{' '}
					System
				</button>
			</li>
		</ul>
	);
};

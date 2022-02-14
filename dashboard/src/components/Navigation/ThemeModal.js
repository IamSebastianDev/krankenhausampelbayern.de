/** @format */

import { useContext, useRef } from 'react';
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
			icon: <Moon size={16} className="mr-2 stroke-2 dark:stroke-1" />,
		},
		{
			onClick: () => themeChangeHandler('light'),
			name: 'Light',
			title: 'Change the colour theme to light.',
			icon: <SunBig size={16} className="mr-2 stroke-2 dark:stroke-1" />,
		},
		{
			onClick: () => themeChangeHandler('system'),
			name: 'System',
			title: 'Change the colour theme to the system default.',
			icon: <Display size={16} className="mr-2 stroke-2 dark:stroke-1" />,
		},
	];

	const isActive = ({ name, systemDefault }) =>
		(theme === name.toLowerCase() && !systemDefault) ||
		(name.toLowerCase() === 'system' && systemDefault);

	return (
		<ul
			ref={themeModalRef}
			className="absolute top-16 right-2 mt-2 flex flex-col overflow-hidden rounded-md border border-zinc-300 bg-zinc-100 tracking-wide text-zinc-700 shadow dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
			{selectors.map(({ onClick, name, title, icon }, index) => (
				<li key={index}>
					<button
						onClick={onClick}
						title={title}
						className={cls(
							'flex min-w-[10rem] select-none flex-row  items-center justify-start px-3 py-1 font-semibold hover:bg-zinc-300 hover:dark:bg-zinc-800',
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

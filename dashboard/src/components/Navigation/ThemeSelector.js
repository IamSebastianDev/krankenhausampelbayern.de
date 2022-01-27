/** @format */
import React, { useContext, useState } from 'react';

import { SunBig, MoonStylized, Display } from 'react-pangolicons';
import { ThemeModal } from './ThemeModal';
import { ThemeCtx } from '../../store/theme.context';

export const ThemeSelector = () => {
	const { theme } = useContext(ThemeCtx);

	const [showThemeModal, setShowThemeModal] = useState(false);
	const toggleThemeModal = () => {
		setShowThemeModal((curState) => !curState);
	};

	const icon = {
		light: <SunBig size={20} className="dark:stroke-1 stroke-2" />,
		dark: <MoonStylized size={20} className="dark:stroke-1 stroke-2" />,
	};

	return (
		<li className="realtive dark:hover:text-blue-500 px-1 mx-2 flex flex-row justify-center items-center">
			<button onClick={toggleThemeModal} title="Open theme menu">
				{icon[theme]}
			</button>
			{showThemeModal && <ThemeModal toggleModal={toggleThemeModal} />}
		</li>
	);
};

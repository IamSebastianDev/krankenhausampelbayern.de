/** @format */
import { useContext, useState } from 'react';

import { SunBig, MoonStylized } from 'react-pangolicons';
import { ThemeModal } from './ThemeModal';
import { ThemeCtx } from '../../store/theme.context';

export const ThemeSelector = () => {
	const { theme } = useContext(ThemeCtx);

	const [showThemeModal, setShowThemeModal] = useState(false);
	const toggleThemeModal = () => {
		setShowThemeModal((curState) => !curState);
	};

	const icon = {
		light: <SunBig size={20} className="stroke-2 dark:stroke-1" />,
		dark: <MoonStylized size={20} className="stroke-2 dark:stroke-1" />,
	};

	return (
		<li className="realtive mx-2 flex flex-row items-center justify-center px-1 dark:hover:text-blue-500">
			<button onClick={toggleThemeModal} title="Open theme menu">
				{icon[theme]}
			</button>
			{showThemeModal && <ThemeModal toggleModal={toggleThemeModal} />}
		</li>
	);
};

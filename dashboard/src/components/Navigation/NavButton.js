/** @format */

import { forwardRef } from 'react';
import { joinClassNames as cls } from '../../scripts/joinClassNames.util';

export const NavButton = forwardRef(
	({ onClick, title, className, children }, ref) => {
		return (
			<li
				className={cls(
					'dark:hover:text-blue-500  px-1 mx-2 flex flex-row justify-center items-center',
					className
				)}>
				<button ref={ref} onClick={onClick} title={title}>
					{children}
				</button>
			</li>
		);
	}
);

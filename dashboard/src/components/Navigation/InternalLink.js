/** @format */

import { forwardRef } from 'react';
import { joinClassNames as cls } from '../../scripts/joinClassNames.util';
import { NavLink } from 'react-router-dom';

export const InternalLink = forwardRef(
	({ to, title, className, children }, ref) => {
		return (
			<li
				className={cls(
					'hover:text-blue-500  px-1 mx-2 flex flex-row justify-center items-center',
					className
				)}>
				<NavLink
					ref={ref}
					title={title}
					rel="noreferrer noopener"
					to={to}>
					{children}
				</NavLink>
			</li>
		);
	}
);

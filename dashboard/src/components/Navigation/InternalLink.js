/** @format */

import { forwardRef } from 'react';
import { joinClassNames as cls } from '../../scripts/joinClassNames.util';
import { NavLink } from 'react-router-dom';

export const InternalLink = forwardRef(
	({ to, title, className, children }, ref) => {
		return (
			<NavLink
				ref={ref}
				title={title}
				rel="noreferrer noopener"
				to={to}
				className={cls(
					'dark:hover:text-blue-500  hover:text-blue-500',
					className
				)}>
				{children}
			</NavLink>
		);
	}
);

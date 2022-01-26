/** @format */

import { forwardRef } from 'react';
import { joinClassNames as cls } from '../../scripts/joinClassNames.util';

export const NavLink = forwardRef(
	({ href, title, target = '_blank', className, children }, ref) => {
		return (
			<li
				className={cls(
					'hover:text-blue-500  px-1 mx-2 flex flex-row justify-center items-center',
					className
				)}>
				<a
					ref={ref}
					href={href}
					title={title}
					rel="noreferrer noopener"
					target={target}>
					{children}
				</a>
			</li>
		);
	}
);

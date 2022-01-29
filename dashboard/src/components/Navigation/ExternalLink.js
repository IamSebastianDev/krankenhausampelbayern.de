/** @format */

import { forwardRef } from 'react';
import { joinClassNames as cls } from '../../scripts/joinClassNames.util';

export const ExternalLink = forwardRef(
	({ href, title, target = '_blank', className, children }, ref) => {
		return (
			<a
				ref={ref}
				href={href}
				title={title}
				rel="noreferrer noopener"
				target={target}
				className={cls(
					'dark:hover:text-blue-500 hover:text-blue-500',
					className
				)}>
				{children}
			</a>
		);
	}
);

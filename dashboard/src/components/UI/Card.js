/** @format */

import { joinClassNames as cls } from '../../scripts/joinClassNames.util';

export const Card = ({ className, children }) => (
	<div
		className={cls(
			'rounded-2xl border border-zinc-300 bg-zinc-100 bg-opacity-50 p-6 shadow-md backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900 dark:bg-opacity-50',
			className
		)}>
		{children}
	</div>
);

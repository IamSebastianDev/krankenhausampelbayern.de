/** @format */

import { joinClassNames as cls } from '../../scripts/joinClassNames.util';

export const Card = ({ className, children }) => (
	<div
		className={cls(
			'bg-zinc-100 dark:bg-zinc-900 p-6 rounded-2xl shadow-md border dark:border-zinc-800 border-zinc-300 dark:bg-opacity-50 bg-opacity-50 backdrop-blur-md',
			className
		)}>
		{children}
	</div>
);

/** @format */

import { joinClassNames as cls } from '../../scripts/joinClassNames.util';

export const Section = ({ id, className, children }) => {
	return (
		<section
			id={id}
			className={cls(
				'dark:bg-zinc-900 bg-zinc-200 min-h-screen py-16',
				className
			)}>
			{children}
		</section>
	);
};

/** @format */

import { joinClassNames as cls } from '../../scripts/joinClassNames.util';

export const Section = ({ id, className, children }) => {
	return (
		<section
			id={id}
			className={cls(
				'dark:bg-zinc-900 bg-zinc-100 min-h-screen py-16',
				'dark:bg-gradient-to-tl dark:from-black dark:to-zinc-900 ',
				className
			)}>
			{children}
		</section>
	);
};

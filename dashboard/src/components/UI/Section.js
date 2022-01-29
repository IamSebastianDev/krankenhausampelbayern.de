/** @format */

import { joinClassNames as cls } from '../../scripts/joinClassNames.util';

export const Section = ({ id, className, children }) => {
	return (
		<section id={id} className={cls('min-h-screen pt-16', className)}>
			{children}
		</section>
	);
};

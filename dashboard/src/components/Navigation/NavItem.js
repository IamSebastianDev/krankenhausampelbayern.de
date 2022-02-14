/** @format */

import { joinClassNames as cls } from '../../scripts/joinClassNames.util';
export const NavItem = ({ className, children }) => {
	return (
		<li
			className={cls(
				'mx-2 flex flex-row items-center justify-center px-1',
				className
			)}>
			{children}
		</li>
	);
};

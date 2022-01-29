/** @format */

import { joinClassNames as cls } from '../../scripts/joinClassNames.util';
export const NavItem = ({ className, children }) => {
	return (
		<li
			className={cls(
				'px-1 mx-2 flex flex-row justify-center items-center',
				className
			)}>
			{children}
		</li>
	);
};

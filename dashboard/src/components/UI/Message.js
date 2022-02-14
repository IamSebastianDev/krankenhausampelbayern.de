/** @format */

import { useState } from 'react';
import { joinClassNames as cls } from '../../scripts/joinClassNames.util';
import { InfoCircle, X } from 'react-pangolicons';

export const Message = ({ children }) => {
	const [isVisible, setIsVisible] = useState(true);

	return (
		<div
			className={cls(
				'relative m-2 flex h-auto flex-col items-center justify-center overflow-hidden border border-red-500 p-4 text-zinc-800 dark:text-red-500 sm:flex-row md:m-4',
				isVisible
					? 'max-h-max opacity-100'
					: 'm-0 max-h-0 border-0 p-0 opacity-0'
			)}>
			<InfoCircle className="my-2 inline-block shrink-0 sm:mr-3" />
			<p className="border-l-red-500 px-4 sm:border-l">{children}</p>
			<button
				className="top-0 right-0 z-10 m-4 sm:absolute  sm:m-2"
				onClick={() => {
					setIsVisible(false);
				}}>
				<X size={16} />
			</button>
		</div>
	);
};

/** @format */

import { useState } from 'react';
import { joinClassNames as cls } from '../../scripts/joinClassNames.util';
import { InfoCircle, X } from 'react-pangolicons';

export const Message = ({ children }) => {
	const [isVisible, setIsVisible] = useState(true);

	return (
		<div
			className={cls(
				'relative dark:text-red-500 text-zinc-800 border border-red-500 p-4 m-2 md:m-4 flex flex-col sm:flex-row justify-center items-center overflow-hidden h-auto',
				isVisible
					? 'max-h-max opacity-100'
					: 'max-h-0 m-0 p-0 border-0 opacity-0'
			)}>
			<InfoCircle className="inline-block my-2 sm:mr-3 shrink-0" />
			<p className="px-4 sm:border-l border-l-red-500">{children}</p>
			<button
				className="sm:absolute top-0 right-0 m-4 sm:m-2  z-10"
				onClick={() => {
					setIsVisible(false);
				}}>
				<X />
			</button>
		</div>
	);
};

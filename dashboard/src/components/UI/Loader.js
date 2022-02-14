/** @format */

import React, { useEffect, useState } from 'react';
import { useScrollLock } from '../../hooks/useScrollLock.hook';
import { joinClassNames as cls } from '../../scripts/joinClassNames.util';

const Spinner = ({ className }) => {
	return (
		<span
			className={cls(
				'absolute h-20 w-20 animate-spin rounded-full',
				className
			)}
		/>
	);
};

export const Loader = ({ loading, id, className }) => {
	const [visible, setVisible] = useState(loading);
	const [animate, setAnimate] = useState(false);

	const [setScrollLock] = useScrollLock();

	useEffect(() => {
		if (loading) {
			setScrollLock(true);
		}

		if (!loading) {
			setAnimate(true);
			window.setTimeout(() => {
				setVisible(false);
			}, 1000);
			setScrollLock(false);
		}
	}, [loading]);

	return (
		<div
			id={id}
			className={cls(
				'transition-transopaque fixed top-0 left-0 z-40 h-full w-full transform flex-col items-center justify-center bg-zinc-200 duration-1000 dark:bg-zinc-900',
				visible ? 'flex' : 'hidden',
				animate ? ' scale-150 opacity-0' : 'scale-100 opacity-100',
				className
			)}>
			<Spinner className="border-r-4 border-r-blue-500" />
			<Spinner className="border-t-4 border-t-sky-500" />
			<Spinner className="border-l-4 border-l-teal-500" />
			<Spinner className="border-b-4 border-b-cyan-500" />
		</div>
	);
};

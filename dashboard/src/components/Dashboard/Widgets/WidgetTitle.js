/** @format */

export const WidgetTitle = ({ title, description }) => {
	const [prim, ...details] = title.split(' ');
	return (
		<div>
			<h3 className="pr-4 tracking-wide md:text-lg">
				{prim}{' '}
				<span className="text-xs uppercase">{details.join(' ')}</span>
			</h3>
			<hr className="my-2 border-zinc-300 dark:border-zinc-700" />
			<p className="text-sm">{description}</p>
		</div>
	);
};

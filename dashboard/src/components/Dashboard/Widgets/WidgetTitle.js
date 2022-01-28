/** @format */

export const WidgetTitle = ({ title, description }) => {
	const [prim, ...details] = title.split(' ');
	return (
		<div>
			<h3 className="md:text-lg tracking-wide pr-4">
				{prim} <span className="text-xs uppercase">{details}</span>
			</h3>
			<hr className="my-2 border-zinc-300 dark:border-zinc-700" />
			<p className="text-sm">{description}</p>
		</div>
	);
};

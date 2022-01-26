/** @format */

import { useData } from './hooks/useData.hook';


const App = ({ children }) => {
	const { data, currentEntry } = useData();
	console.log({ data, currentEntry });
	return (
		<section
			className="dark:bg-zinc-900 bg-zinc-200 min-h-screen w-full"
			id="dashboard">
			{children}
		</section>
	);
};

export default App;

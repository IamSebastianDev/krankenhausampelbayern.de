/** @format */

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// global contexts
import { ThemeContext } from './store/theme.context';
import { DataContext } from './store/data.context';

// layouts
import { Navigation } from './components/Navigation/Navigation';

// routes
import { Dashboard } from './components/Dashboard/Dashboard';
import { Interface } from './components/Interface/Interface';

const App = () => {
	return (
		<ThemeContext>
			<DataContext>
				<Router>
					<Navigation />
					<main>
						<Routes>
							<Route exact path="/" element={<Dashboard />} />
							<Route
								exact
								path="/interface"
								element={<Interface />}
							/>
						</Routes>
					</main>
				</Router>
			</DataContext>
		</ThemeContext>
	);
};

export default App;

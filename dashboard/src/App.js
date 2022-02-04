/** @format */

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// global contexts
import { ThemeContext } from './store/theme.context';
import { DataContext } from './store/data.context';

// layouts
import { Navigation } from './components/Navigation/Navigation';
import { Footer } from './components/UI/Footer';
import { PrivacyModal } from './components/UI/Privacy';

// routes
import { Dashboard } from './components/Dashboard/Dashboard';
import { Legal } from './components/Legal/Legal';

const App = () => {
	return (
		<ThemeContext>
			<DataContext>
				<Router>
					<Navigation />
					<main>
						<Routes>
							<Route exact path="/" element={<Dashboard />} />
							<Route exact path="/legal" element={<Legal />} />
						</Routes>
					</main>
					<Footer />
					<PrivacyModal />
				</Router>
			</DataContext>
		</ThemeContext>
	);
};

export default App;

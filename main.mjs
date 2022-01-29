/** @format */

// Import dependencies

import './config/dotenv.config.mjs';
import path from 'path';
import Express from 'express';

// Setup the Express app.

const App = Express();
const PORT = process.env.PORT || 31415;

/**
 * Create a automatic https redirect if the app is running production mode.
 */

if (process.env.production) {
	App.enable('trust proxy');
	App.use((req, res, next) =>
		req.secure
			? next()
			: res.redirect('https://' + req.headers.host + req.url)
	);
}

import { handleApiRequest } from './api/index.mjs';
App.get('/api', handleApiRequest);

App.use(Express.static(path.resolve(process.cwd(), './dashboard/build')));

App.listen(PORT);

/**
 * If the app is not runnin in production mode, import the presentDetails method
 * and run it to log the details of the package to the console.
 */

if (!process.env.production) {
	const { presentDetails } = await import('dev-server-details');
	presentDetails({ PORT });
}

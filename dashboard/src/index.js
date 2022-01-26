/** @format */

import React from 'react';
import ReactDOM from 'react-dom';
import './resets.css';
import './index.css';

import { ThemeContext, ThemeCtx } from './store/theme.context';

import App from './App.js';
import { Navigation } from './components/Navigation/Navigation';

ReactDOM.render(
	<React.StrictMode>
		<ThemeContext>
			<Navigation />
			<App />
		</ThemeContext>
	</React.StrictMode>,
	document.getElementById('root')
);

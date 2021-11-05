/** @format */

import { terser } from 'rollup-plugin-terser';

export default {
	input: 'src/app.mjs',
	output: [
		{
			file: './public/scripts/bundle.min.mjs',
			format: 'es',
			plugins: [terser()],
		},
	],
};

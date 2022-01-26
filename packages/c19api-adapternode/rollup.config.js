/** @format */

import { terser } from 'rollup-plugin-terser';

export default [
	{
		input: 'src/index.js',
		output: [
			{
				file: './dist/index.js',
				format: 'cjs',
				plugins: [terser({ module: false, toplevel: true })],
				sourcemap: true,
			},
			{
				file: './dist/index.esm.mjs',
				format: 'esm',
				plugins: [terser()],
				sourcemap: true,
			},
		],
	},
];

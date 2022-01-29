/** @format */

module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{js,mjs,jsx,ts,tsx}', './public/index.html'],
	theme: {
		extend: {
			fontFamily: {
				nunito: ['nunito', 'system-ui', 'sans-serif'],
			},
			transitionProperty: {
				transopaque: 'opacity, transform',
			},
			boxShadow: {
				tl: '0px 0px 2px 5px var(--tw-shadow-color), 2px 2px 4px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px 4px rgba(0, 0, 0, 0.5), inset 0px 0px 4px rgba(0, 0, 0, 0.5)',
			},
		},
	},
	plugins: [],
};

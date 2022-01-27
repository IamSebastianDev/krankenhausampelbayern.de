/** @format */

module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				nunito: ['nunito', 'system-ui', 'sans-serif'],
			},
			transitionProperty: {
				transopaque: 'opacity, transform',
			},
		},
	},
	plugins: [],
};

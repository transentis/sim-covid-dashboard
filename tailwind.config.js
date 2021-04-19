module.exports = {
	purge: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
		fontFamily: {
			transentis: ['franklin-gothic-urw', 'sans-serif'],
		},
		colors: {
			cyan: {
				DEFAULT: '#009696',
				light: '#60C0C0',
				dark: '#004b4b',
			},
			orange: {
				DEFAULT: '#FF8200',
				light: '#FFb466',
				dark: '#804100',
			},
			bg: {
				DEFAULT: '#222222',
				paper: '#333333',
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}

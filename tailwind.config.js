const colors = require('tailwindcss/colors')

module.exports = {
	purge: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	darkMode: 'media',
	theme: {
		extend: {
			typography: {
				DEFAULT: {
					css: {
						color: 'white',
						a: {
							color: '#009696',
							'&:hover': {
								color: '#004b4b',
							},
						},
					},
				},
			},
		},
		fontFamily: {
			transentis: ['franklin-gothic-urw', 'sans-serif'],
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require('@tailwindcss/typography')],
}

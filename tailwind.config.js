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
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
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
			white: colors.white,
			purple: colors.purple,
			bg: {
				DEFAULT: '#222222',
				paper: '#333333',
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require('@tailwindcss/typography')],
}

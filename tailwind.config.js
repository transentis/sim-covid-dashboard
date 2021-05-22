const colors = require('tailwindcss/colors')

module.exports = {
	purge: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	darkMode: 'media',
	theme: {
		fontFamily: {
			transentis: ['franklin-gothic-urw', 'sans-serif'],
		},
		extend: {
			typography: (theme) => ({
				DEFAULT: {
					css: {
						a: {
							color: 'hsl(var(--p)) !important',
							'&:link': {
								color: 'hsl(var(--p)) !important',
							},
							'&:visited': {
								color: 'hsl(var(--p)) !important',
							},
							'&:hover': {
								color: 'hsl(var(--pf)) !important',
							},
							'&:active': {
								color: 'hsl(var(--pf)) !important',
							},
						},
					},
				},
			}),
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require('@tailwindcss/typography')],
}

const colors = require('tailwindcss/colors')

module.exports = {
	purge: {
		content: [
			'./pages/**/*.{js,ts,jsx,tsx}',
			'./components/**/*.{js,ts,jsx,tsx}',
			'./node_modules/@transentis/bptk-widgets/build/**/*.{js,ts,jsx,tsx}',
		],
	},
	darkMode: 'media',
	theme: {
		fontFamily: {
			transentis: ['Open Sans'],
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

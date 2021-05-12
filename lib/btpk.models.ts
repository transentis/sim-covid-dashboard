import { equations as eq } from './equations.tabs.map'

export const defaultModel = (
	scenarioManager = 'smSir',
	scenario = 'dashboard',
	equations = [
		...eq.contact_rate.equations,
		...eq.indicators.equations,
		...eq.intensiveCare.equations,
		...eq.population.equations,
	],
	settings = {
		smSir: {
			dashboard: {
				constants: {},
				points: {
					contact_rate_table: [
						[0, 20],
						[100, 20],
						[200, 20],
						[300, 20],
						[400, 20],
						[500, 20],
						[600, 20],
						[700, 20],
						[800, 20],
						[900, 20],
						[1000, 20],
						[1100, 20],
						[1200, 20],
						[1300, 20],
						[1400, 20],
						[1500, 20],
					],
				},
			},
		},
	},
) => ({
	scenario_managers: [scenarioManager],
	scenarios: [scenario],
	equations: equations,
	settings: settings,
})

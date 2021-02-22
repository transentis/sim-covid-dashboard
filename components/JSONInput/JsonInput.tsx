import React, { ReactElement } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { Box } from '@material-ui/core'

import JSONInput from 'react-json-editor-ajrm'
import locale from 'react-json-editor-ajrm/locale/en'

const useStyles = makeStyles((theme) => ({
	root: {},
}))

interface Props {
	onChange?: (input) => void
}

const JsonInput = ({ onChange }: Props): ReactElement => {
	const classes = useStyles()
	return (
		<Box className={classes.root}>
			<JSONInput
				id='jsonInput'
				placeholder={{
					scenario_managers: ['smSir'],
					scenarios: ['dashboard'],
					equations: ['contact_rate', 'reproduction_rate'],
					settings: {
						smSir: {
							dashboard: {
								constants: {
									normal_contact_rate: 20.0,
									distancing_contact_rate: 5.0,
									distancing_begin: 50.0,
									distancing_duration: 500.0,
									distancing_on: 0.0,
									dashboard_on: 1.0,
								},
							},
						},
					},
				}}
				locale={locale}
				height='400px'
				width='100%'
				onChange={onChange}
			/>
		</Box>
	)
}

export default JsonInput

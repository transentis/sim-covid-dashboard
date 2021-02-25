import React, { ReactElement } from 'react'
import {
	VictoryChart,
	VictoryChartProps,
	VictoryLine,
	VictoryLineProps,
} from 'victory'

import { makeStyles } from '@material-ui/core/styles'

import { Box } from '@material-ui/core'

const useStyles = makeStyles(() => ({
	root: {},
	line: {},
}))

interface Props extends VictoryChartProps {
	line?: VictoryLineProps
}

const LineChart = (props: Props): ReactElement => {
	const classes = useStyles()
	const { line, ...rest } = props

	return (
		<Box className={classes.root}>
			<VictoryChart {...rest}>
				<VictoryLine
					style={
						line.style || {
							data: {
								stroke: 'rgb(106, 237, 199)',
								strokeWidth: '2.5px',
							},
						}
					}
					animate={
						line?.animate || {
							duration: 2000,
							onLoad: { duration: 1000 },
						}
					}
					data={line?.data}
					categories={line?.categories}
				></VictoryLine>
			</VictoryChart>
		</Box>
	)
}

export default LineChart

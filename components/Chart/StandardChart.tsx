import React, { ReactElement } from 'react'
import {
	VictoryArea,
	VictoryAreaProps,
	VictoryChart,
	VictoryChartProps,
	VictoryLine,
	VictoryLineProps,
} from 'victory'

import { makeStyles } from '@material-ui/core/styles'

import { Box } from '@material-ui/core'
import { lineOrArea } from '../../lib/types/data.types'
import { LINE } from '../../lib/constants/data.consts'

const useStyles = makeStyles(() => ({
	root: {
		height: '100%',
	},
	line: {},
}))

interface Props extends VictoryChartProps {
	type: lineOrArea
	chartProps?: VictoryLineProps | VictoryAreaProps
}

const LineChart = (props: Props): ReactElement => {
	const classes = useStyles()
	const { type, chartProps, ...rest } = props

	return (
		<Box className={classes.root}>
			<VictoryChart {...rest}>
				{type === LINE ? (
					<VictoryLine
						interpolation='natural'
						style={
							chartProps?.style || {
								data: {
									stroke: 'rgb(106, 237, 199)',
									strokeWidth: '2.5px',
								},
							}
						}
						animate={
							chartProps?.animate || {
								duration: 2000,
								onLoad: { duration: 1000 },
							}
						}
						data={chartProps?.data}
						categories={chartProps?.categories}
					></VictoryLine>
				) : (
					<VictoryArea
						interpolation='natural'
						style={
							chartProps?.style || {
								data: {
									stroke: 'rgb(106, 237, 199)',
									strokeWidth: '4px',
									fill: 'rgb(106, 237, 199)',
									fillOpacity: 0.6,
								},
							}
						}
						animate={
							chartProps?.animate || {
								duration: 2000,
								onLoad: { duration: 1000 },
							}
						}
						data={chartProps?.data}
						categories={chartProps?.categories}
					></VictoryArea>
				)}
				<VictoryLine
					style={
						chartProps?.style || {
							data: {
								stroke: 'rgb(106, 237, 199)',
								strokeWidth: '2.5px',
							},
						}
					}
					animate={
						chartProps?.animate || {
							duration: 2000,
							onLoad: { duration: 1000 },
						}
					}
					data={chartProps?.data}
					categories={chartProps?.categories}
				></VictoryLine>
			</VictoryChart>
		</Box>
	)
}

export default LineChart

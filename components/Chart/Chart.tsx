import React, { ReactElement } from 'react'
import {
	VictoryArea,
	VictoryAreaProps,
	VictoryChart,
	VictoryChartProps,
	VictoryLegend,
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
	line?: boolean
	area?: boolean
	lineProps?: VictoryLineProps
	areaProps?: VictoryAreaProps
}

const LineChart = (props: Props): ReactElement => {
	const classes = useStyles()
	const { line = true, area = false, lineProps, areaProps, ...rest } = props

	const chartType = area ? false : true
	return (
		<Box className={classes.root}>
			<VictoryChart {...rest}>
				{chartType ? (
					<VictoryLine
						interpolation='natural'
						style={
							lineProps.style || {
								data: {
									stroke: 'rgb(106, 237, 199)',
									strokeWidth: '2.5px',
								},
							}
						}
						animate={
							lineProps?.animate || {
								duration: 2000,
								onLoad: { duration: 1000 },
							}
						}
						data={lineProps?.data}
						categories={lineProps?.categories}
					></VictoryLine>
				) : (
					<VictoryArea
						interpolation='natural'
						style={
							lineProps.style || {
								data: {
									stroke: 'rgb(106, 237, 199)',
									strokeWidth: '4px',
									fill: 'rgb(106, 237, 199)',
									fillOpacity: 0.6,
								},
							}
						}
						animate={
							lineProps?.animate || {
								duration: 2000,
								onLoad: { duration: 1000 },
							}
						}
						data={lineProps?.data}
						categories={lineProps?.categories}
					></VictoryArea>
				)}
				<VictoryLine
					style={
						lineProps.style || {
							data: {
								stroke: 'rgb(106, 237, 199)',
								strokeWidth: '2.5px',
							},
						}
					}
					animate={
						lineProps?.animate || {
							duration: 2000,
							onLoad: { duration: 1000 },
						}
					}
					data={lineProps?.data}
					categories={lineProps?.categories}
				></VictoryLine>
				<VictoryLegend
					x={50}
					y={200}
					orientation='vertical'
					style={{
						title: { fontSize: 20, fill: 'white' },
						labels: { fill: 'white' },
					}}
					data={[{ name: 'One' }, { name: 'Two' }, { name: 'Three' }]}
				/>
			</VictoryChart>
		</Box>
	)
}

export default LineChart

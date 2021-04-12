import React, { ReactElement } from 'react'
import {
	VictoryArea,
	VictoryAreaProps,
	VictoryAxis,
	VictoryChart,
	VictoryChartProps,
	VictoryLabel,
	VictoryLine,
	VictoryLineProps,
} from 'victory'

import { makeStyles } from '@material-ui/core/styles'

import { Box } from '@material-ui/core'
import { lineOrArea } from '../../lib/types/data.types'
import { LINE } from '../../lib/constants/data.consts'

const useStyles = makeStyles(() => ({
	root: {},
	line: {},
}))

interface Props extends VictoryChartProps {
	type: lineOrArea
	chartProps?: VictoryLineProps | VictoryAreaProps
	size: { width: number; height: number }
	labeling: { x: string; y: string }
}

const LineChart = (props: Props): ReactElement => {
	const classes = useStyles()
	const { type, chartProps, size, labeling, ...rest } = props

	return (
		<div
			className={classes.root}
			style={{
				width: size.width,
				height: size.height,
				display: 'flex',
				flexWrap: 'wrap',
			}}
		>
			<VictoryChart
				{...rest}
				height={size.height}
				width={size.width}
				style={{ parent: { maxWidth: '100%', maxHeight: '100%' } }}
				padding={{ left: 120, right: 80, top: 40, bottom: 70 }}
			>
				<VictoryAxis
					crossAxis
					axisLabelComponent={<VictoryLabel dy={10} />}
					label={labeling.x}
					style={{ axisLabel: { fontSize: 25, padding: 20 } }}
				/>
				<VictoryAxis
					dependentAxis
					crossAxis
					axisLabelComponent={<VictoryLabel dy={-70} />}
					label={labeling.y}
					style={{ axisLabel: { fontSize: 25, padding: 20 } }}
				/>
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
		</div>
	)
}

export default LineChart

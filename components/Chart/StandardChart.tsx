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
	size?: { width?: number; height?: number }
	labeling?: { x?: string; y?: string }
}

const LineChart = (props: Props): ReactElement => {
	const classes = useStyles()
	const { type, chartProps, size, labeling, ...rest } = props

	return (
		<div
			className={classes.root}
			style={{
				display: 'flex',
				flexWrap: 'wrap',
			}}
		>
			<VictoryChart
				{...rest}
				height={size?.height}
				width={size?.width}
				style={{ parent: { maxWidth: '90%' } }}
			>
				{labeling?.x && (
					<VictoryAxis
						axisLabelComponent={<VictoryLabel dx={labeling.x} />}
					/>
				)}
				{labeling?.y && (
					<VictoryAxis
						axisLabelComponent={<VictoryLabel dy={labeling.y} />}
					/>
				)}
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

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

import { lineOrArea } from '../../lib/types/data.types'
import { AREA, LINE } from '../../lib/constants/data.consts'
import AreaChart from './AreaChart'
import LineChart from './LineChart'
import MultiLineChart from './MultiLineChart'
import StackedAreaChart from './StackedAreaChart'

interface Props extends VictoryChartProps {
	type: lineOrArea
	chartProps?: VictoryLineProps | VictoryAreaProps
	size?: { width?: number; height?: number }
	labeling: { x: string; y: string }
}

const Line = (chartProps: VictoryLineProps) => {
	const isStacked = Array.isArray(chartProps.data[0])
	if (isStacked) {
		return (
			<>
				{chartProps.data.map((data, index) => {
					return (
						<VictoryLine
							key={index}
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
							data={data}
							categories={chartProps?.categories}
						></VictoryLine>
					)
				})}
			</>
		)
	}
	return (
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
	)
}

const Area = React.forwardRef((chartProps: VictoryAreaProps, ref) => {
	const isStacked = Array.isArray(chartProps.data[0])
	if (isStacked) {
		return (
			<>
				{chartProps.data.map((data, index) => {
					return (
						<VictoryArea
							key={index}
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
							data={data}
							categories={chartProps?.categories}
						></VictoryArea>
					)
				})}
			</>
		)
	}
	return (
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
	)
})

const StandardChart = (props: Props): ReactElement => {
	const { type, chartProps, labeling } = props
	const isStacked = Array.isArray(chartProps.data[0])

	let { size } = props
	const defaultHeight = 300
	const defaultWidth = 450

	!size && (size = { height: defaultHeight, width: defaultWidth })
	!size.height && (size.height = defaultHeight)
	!size.width && (size.width = defaultWidth)

	return (
		<div
			style={{
				height: size.height,
				width: size.width,
				display: 'flex',
				flexWrap: 'wrap',
			}}
		>
			{type === AREA ? (
				<>
					{isStacked ? (
						<StackedAreaChart
							chartProps={chartProps as VictoryAreaProps}
							labeling={labeling}
							size={size}
						></StackedAreaChart>
					) : (
						<AreaChart
							chartProps={chartProps as VictoryAreaProps}
							labeling={labeling}
							size={size}
						></AreaChart>
					)}
				</>
			) : (
				<>
					{isStacked ? (
						<MultiLineChart
							chartProps={chartProps as VictoryLineProps}
							labeling={labeling}
							size={size}
						></MultiLineChart>
					) : (
						<LineChart
							chartProps={chartProps as VictoryLineProps}
							labeling={labeling}
							size={size}
						></LineChart>
					)}
				</>
			)}
		</div>
	)
}

export default StandardChart

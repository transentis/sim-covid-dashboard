import React, { ReactElement } from 'react'
import {
	VictoryArea,
	VictoryAreaProps,
	VictoryAxis,
	VictoryChart,
	VictoryChartProps,
	VictoryLabel,
} from 'victory'

interface Props extends VictoryChartProps {
	chartProps?: VictoryAreaProps
	size?: { width?: number; height?: number }
	labeling: { x: string; y: string }
}

const StackedAreaChart = (props: Props): ReactElement => {
	const { chartProps, labeling, ...rest } = props

	let { size } = props
	const defaultHeight = 300
	const defaultWidth = 450

	!size && (size = { height: defaultHeight, width: defaultWidth })
	!size.height && (size.height = defaultHeight)
	!size.width && (size.width = defaultWidth)

	return (
		<VictoryChart
			{...rest}
			height={size.height}
			width={size.width}
			style={{ parent: { maxWidth: '100%', maxHeight: '100%' } }}
			padding={{ left: 120, right: 80, top: 40, bottom: 70 }}
		>
			<VictoryAxis
				crossAxis
				axisLabelComponent={
					<VictoryLabel
						dy={10}
						style={{ fill: 'white', fontSize: 25, padding: 20 }}
					/>
				}
				label={labeling.x}
			/>
			<VictoryAxis
				dependentAxis
				crossAxis
				axisLabelComponent={
					<VictoryLabel
						dy={-70}
						style={{ fill: 'white', fontSize: 25, padding: 20 }}
					/>
				}
				label={labeling.y}
			/>
			{chartProps.data.map((data, index) => {
				return (
					<VictoryArea
						interpolation='natural'
						style={
							chartProps?.style || {
								data: {
									stroke: `rgb(106, ${
										(237 * (index + 1)) % 255
									}, 199)`,
									strokeWidth: '4px',
									fill: `rgb(106, ${237 % 255}, 199)`,
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
		</VictoryChart>
	)
}

export default StackedAreaChart

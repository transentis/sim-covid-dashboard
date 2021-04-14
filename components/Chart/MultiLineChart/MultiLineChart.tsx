import React, { ReactElement } from 'react'
import {
	VictoryAreaProps,
	VictoryAxis,
	VictoryChart,
	VictoryChartProps,
	VictoryLabel,
	VictoryLine,
	VictoryLineProps,
} from 'victory'

interface Props extends VictoryChartProps {
	chartProps?: VictoryLineProps
	size?: { width?: number; height?: number }
	labeling: { x: string; y: string }
}

const MultiLineChart = (props: Props): ReactElement => {
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
			{chartProps.data.map((data, index) => (
				<VictoryLine
					interpolation='natural'
					style={
						chartProps?.style || {
							data: {
								stroke: `rgb(106, ${
									(237 * (index + 1)) % 255
								}, 199)`,
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
			))}
		</VictoryChart>
	)
}

export default MultiLineChart

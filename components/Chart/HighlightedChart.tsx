import React, { ReactElement } from 'react'
import {
	VictoryLine,
	VictoryArea,
	VictoryChart,
	VictoryChartProps,
	VictoryLineProps,
	VictoryAreaProps,
	VictoryAxis,
	VictoryLabel,
} from 'victory'

import { makeStyles } from '@material-ui/core/styles'

import { Box } from '@material-ui/core'
import { axes, lineOrArea } from '../../lib/types/data.types'
import { fixStandardAreas } from '../../helpers/data.helpers'
import { LINE, Y } from '../../lib/constants/data.consts'

const useStyles = makeStyles(() => ({
	root: {
		height: '100%',
	},
	line: {},
}))

interface Props extends VictoryChartProps {
	type: lineOrArea
	chartProps?: VictoryLineProps | VictoryAreaProps
	size?: { width?: number; height?: number }
	highlighting: {
		type: axes
		areas: { start?: number; end?: number; color: string }[]
	}
	labeling: { x: string; y: string }
}

const YHighlightedLineChart = (props: Props): ReactElement => {
	const classes = useStyles()
	const { type, chartProps, highlighting, labeling, ...rest } = props
	let { size } = props
	const defaultHeight = 300
	const defaultWidth = 450
	const allAreas = fixStandardAreas(highlighting, '#2a9d8f', chartProps)

	!size && (size = { height: defaultHeight, width: defaultWidth })
	!size.height && (size.height = defaultHeight)
	!size.width && (size.width = defaultWidth)

	const CustomClip = ({ ...props }) => {
		return (
			<defs key='clips'>
				{allAreas.map(
					(
						area: { start: number; end: number; color: string },
						index: number,
					) => (
						<clipPath key={index} id={`clip-path-${index}`}>
							<rect
								x={
									highlighting.type === Y
										? 0
										: props.scale.x(area.start)
								}
								y={
									highlighting.type === Y
										? props.scale.y(area.end)
										: 0
								}
								width={
									highlighting.type === Y
										? '100%'
										: props.scale.x(area.end) -
										  props.scale.x(area.start)
								}
								height={
									highlighting.type === Y
										? props.scale.y(area.start) -
										  props.scale.y(area.end)
										: '100%'
								}
							/>
						</clipPath>
					),
				)}
			</defs>
		)
	}

	const GradientFill = () => (
		<defs>
			{allAreas.map((area, index: number) => (
				<linearGradient
					key={index}
					id={`${index}Gradient`}
					x1='0%'
					x2={highlighting.type === Y ? '0%' : '100%'}
					y1='0%'
					y2={highlighting.type === Y ? '100%' : '0%'}
				>
					<stop
						offset='100%'
						stopColor={allAreas[index].color}
						stopOpacity={type === LINE ? 0 : 1}
					/>
					<stop
						offset='0%'
						stopColor={allAreas[index].color}
						stopOpacity={type === LINE ? 0 : 1}
					/>
				</linearGradient>
			))}
		</defs>
	)

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
				{allAreas.map((area, index: number) => (
					<VictoryArea
						key={index}
						style={{
							data: {
								stroke: area.color,
								strokeWidth: 2,
								clipPath: `url(#clip-path-${index})`,
								fill: `url(#${index}Gradient)`,
							},
						}}
						animate={
							chartProps?.animate || {
								duration: 2000,
								onLoad: { duration: 1000 },
							}
						}
						categories={chartProps?.categories}
						data={chartProps?.data}
					/>
				))}
				<CustomClip />
				<GradientFill />
			</VictoryChart>
		</div>
	)
}

export default YHighlightedLineChart

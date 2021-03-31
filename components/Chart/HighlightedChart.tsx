import React, { ReactElement } from 'react'
import {
	VictoryLine,
	VictoryArea,
	VictoryChart,
	VictoryChartProps,
	VictoryLineProps,
	VictoryAreaProps,
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
	highlighting?: {
		type: axes
		areas: { start?: number; end?: number; color: string }[]
	}
}

const YHighlightedLineChart = (props: Props): ReactElement => {
	const classes = useStyles()
	const { type, chartProps, highlighting, size, ...rest } = props

	const allAreas = fixStandardAreas(highlighting, '#2a9d8f', chartProps)

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
		<Box className={classes.root}>
			<VictoryChart {...rest} height={size?.height} width={size?.width}>
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
						data={chartProps.data}
					/>
				))}
				<CustomClip />
				<GradientFill />
			</VictoryChart>
		</Box>
	)
}

export default YHighlightedLineChart

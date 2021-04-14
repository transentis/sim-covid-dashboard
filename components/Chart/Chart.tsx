import React, { ReactElement } from 'react'
import { VictoryChartProps, VictoryLineProps, VictoryAreaProps } from 'victory'

import { makeStyles } from '@material-ui/core/styles'

import StandardChart from './StandardChart'
import HighlightedChart from './HighlightedChart'
import { axes, lineOrArea } from '../../lib/types/data.types'

const useStyles = makeStyles(() => ({
	root: {},
	line: {},
}))

interface Props extends VictoryChartProps {
	type: lineOrArea
	chartProps?: VictoryLineProps | VictoryAreaProps
	highlighting?: {
		type: axes
		areas: { start?: number; end?: number; color: string }[]
	}
	size?: { width?: number; height?: number }
	labeling: { x: string; y: string }
	legend?: Array<Legend>
}

interface Legend {
	name: string
	color: string
}

const LineChart = (props: Props): ReactElement => {
	const classes = useStyles()
	const defaultHeight = 300
	const defaultWidth = 450
	const { size = { height: defaultHeight, width: defaultWidth } } = props
	const { highlighting, ...rest } = props

	// console.log(size)

	return !highlighting ? (
		// @ts-ignore
		<StandardChart size={size} {...rest} />
	) : (
		// @ts-ignore
		<HighlightedChart size={size} highlighting={highlighting} {...rest} />
	)
}

export default LineChart

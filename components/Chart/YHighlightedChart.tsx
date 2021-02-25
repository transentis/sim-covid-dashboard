import React, { ReactElement } from 'react';
import { VictoryLine, VictoryArea, VictoryChart, VictoryChartProps, VictoryLineProps, VictoryAreaProps } from 'victory';

import { makeStyles } from '@material-ui/core/styles';

import { Box } from '@material-ui/core';
import { axes } from '../../lib/types/data.types';

const useStyles = makeStyles(() => ({
	root: {},
	line: {},
}));

interface Props extends VictoryChartProps {
	line?: boolean;
	area?: boolean;
	lineProps?: VictoryLineProps;
	areaProps?: VictoryAreaProps;
	highlighting?: {
		type: axes;
		areas: { start: number; end: number; color: string }[];
	};
}

const YHighlightedLineChart = (props: Props): ReactElement => {
	const classes = useStyles();
	const { line = true, area = false, lineProps, areaProps, highlighting, ...rest } = props;

	const CustomClip = ({ ...props }) => {
		return (
			<defs key="clips">
				{highlighting.areas.map((area: { start: number; end: number; color: string }, index: number) => (
					<clipPath key={index} id={`clip-path-${index}`}>
						<rect
							x="0"
							y={props.scale.y(area.end)}
							width="100%"
							height={props.scale.y(area.start) - props.scale.y(area.end)}
						/>
					</clipPath>
				))}
				<clipPath key={highlighting.areas.length} id={`clip-path-g`}>
					<rect x="0" y={0} width="100%" height={'100%'} />
				</clipPath>
			</defs>
		);
	};

	const GradientFill = () => (
		<defs>
			{highlighting.areas.map((area, index: number) => (
				<linearGradient key={index} id={`${index}Gradient`} x1="0%" x2="0%" y1="0%" y2="100%">
					<stop offset="100%" stopColor={highlighting.areas[index].color} stopOpacity="0" />
					<stop offset="0%" stopColor={highlighting.areas[index].color} stopOpacity="0.5" />
				</linearGradient>
			))}
			<linearGradient key={highlighting.areas.length} id={`gGradient`} x1="0%" x2="0%" y1="0%" y2="100%">
				<stop offset="100%" stopColor={'#c43a31'} stopOpacity="0" />
				<stop offset="0%" stopColor={'#c43a31'} stopOpacity="0.5" />
			</linearGradient>
		</defs>
	);

	return (
		<Box className={classes.root}>
			<VictoryChart {...rest}>
				<VictoryLine
					style={{
						data: {
							stroke: '#c43a31',
							strokeWidth: 2,
						},
					}}
					animate={
						lineProps?.animate || {
							duration: 2000,
							onLoad: { duration: 1000 },
						}
					}
					categories={lineProps?.categories}
					data={lineProps.data}
				/>
				{highlighting.areas.map((area, index: number) => (
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
							lineProps?.animate || {
								duration: 2000,
								onLoad: { duration: 1000 },
							}
						}
						categories={lineProps?.categories}
						data={lineProps.data}
					/>
				))}
				<CustomClip />
				<GradientFill />
			</VictoryChart>
		</Box>
	);
};

export default YHighlightedLineChart;

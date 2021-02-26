import React, { ReactElement } from 'react';
import { VictoryLine, VictoryArea, VictoryChart, VictoryChartProps, VictoryLineProps, VictoryAreaProps } from 'victory';

import { makeStyles } from '@material-ui/core/styles';

import { Box } from '@material-ui/core';
import { axes } from '../../lib/types/data.types';
import { addStandardAreas } from '../../helpers/data.helpers';

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

	const mockData = [
		{ x: 0, y: 0 },
		{ x: 1, y: 10 },
		{ x: 2, y: 0 },
		{ x: 3, y: 10 },
		{ x: 4, y: 0 },
		{ x: 5, y: 10 },
		{ x: 6, y: 0 },
		{ x: 7, y: 10 },
		{ x: 8, y: 0 },
		{ x: 9, y: 10 },
		{ x: 10, y: 0 },
	];

	const allAreas = addStandardAreas(highlighting, '#c43a31', lineProps);

	const CustomClip = ({ ...props }) => {
		return (
			<defs key="clips">
				{allAreas.map((area: { start: number; end: number; color: string }, index: number) => (
					<clipPath key={index} id={`clip-path-${index}`}>
						<rect
							x="0"
							y={props.scale.y(area.end)}
							width="100%"
							height={props.scale.y(area.start) - props.scale.y(area.end)}
						/>
					</clipPath>
				))}
			</defs>
		);
	};

	const GradientFill = () => (
		<defs>
			{allAreas.map((area, index: number) => (
				<linearGradient key={index} id={`${index}Gradient`} x1="0%" x2="0%" y1="0%" y2="100%">
					<stop offset="100%" stopColor={allAreas[index].color} stopOpacity="1" />
					<stop offset="0%" stopColor={allAreas[index].color} stopOpacity="1" />
				</linearGradient>
			))}
		</defs>
	);

	return (
		<Box className={classes.root}>
			<VictoryChart {...rest}>
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
							lineProps?.animate || {
								duration: 2000,
								onLoad: { duration: 1000 },
							}
						}
						categories={lineProps?.categories}
						data={mockData}
					/>
				))}
				<CustomClip />
				<GradientFill />
			</VictoryChart>
		</Box>
	);
};

export default YHighlightedLineChart;

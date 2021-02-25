import React, { ReactElement, ReactNode } from 'react';
import { VictoryChart, VictoryChartProps, VictoryLine, VictoryLineProps } from 'victory';

import { makeStyles } from '@material-ui/core/styles';

import { Box } from '@material-ui/core';
import { filterByColor } from '../../helpers/data.helpers';

const useStyles = makeStyles(() => ({
	root: {},
	line: {},
}));

interface Props extends VictoryChartProps {
	line?: VictoryLineProps;
	highlighting?: {
		type: 'x' | 'y';
		areas: { start: number; end: number; color: string }[];
	};
}

const XHighlightedLineChart = (props: Props): ReactElement => {
	const classes = useStyles();
	const { line, highlighting, ...rest } = props;

	return (
		<Box className={classes.root}>
			<VictoryChart {...rest}>
				<VictoryLine
					style={
						line.style || {
							data: { stroke: ({ datum }) => (datum.y < 6 ? 'red' : 'black') },
							parent: { border: '1px solid #ccc' },
						}
					}
					animate={
						line?.animate || {
							duration: 2000,
							onLoad: { duration: 1000 },
						}
					}
					data={line?.data}
					categories={line?.categories}
				></VictoryLine>
			</VictoryChart>
		</Box>
	);
};

export default XHighlightedLineChart;

import React, { ReactElement, ReactNode } from 'react';
import { VictoryChart, VictoryChartProps, VictoryLine, VictoryLineProps } from 'victory';

import { makeStyles } from '@material-ui/core/styles';

import StandardLineChart from './StandardLineChart';
import XHighlightedLineChart from './XHighlightedLineChart';
import YHighlightedLineChart from './YHighlightedLineChart';
import { axes } from '../../lib/types/data.types';
import { X } from '../../lib/constants/data.consts';

const useStyles = makeStyles(() => ({
	root: {},
	line: {},
}));

interface Props extends VictoryChartProps {
	line?: VictoryLineProps;
	highlighting?: {
		type: axes;
		areas: { start: number; end: number; color: string }[];
	};
}

const LineChart = (props: Props): ReactElement => {
	const classes = useStyles();
	const { highlighting, ...rest } = props;

	return !highlighting ? (
		<StandardLineChart {...rest} />
	) : highlighting.type === X ? (
		<XHighlightedLineChart highlighting={highlighting} {...rest} />
	) : (
		<YHighlightedLineChart highlighting={highlighting} {...rest} />
	);
};

export default LineChart;

import React, { ReactElement } from 'react';
import { VictoryChartProps, VictoryLineProps, VictoryAreaProps } from 'victory';

import { makeStyles } from '@material-ui/core/styles';

import StandardChart from './StandardChart';
import XHighlightedChart from './XHighlightedChart';
import YHighlightedChart from './YHighlightedChart';
import { axes } from '../../lib/types/data.types';
import { X } from '../../lib/constants/data.consts';

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

const LineChart = (props: Props): ReactElement => {
	const classes = useStyles();
	const { highlighting, ...rest } = props;

	return !highlighting ? (
		<StandardChart {...rest} />
	) : highlighting.type === X ? (
		<XHighlightedChart highlighting={highlighting} {...rest} />
	) : (
		<YHighlightedChart highlighting={highlighting} {...rest} />
	);
};

export default LineChart;

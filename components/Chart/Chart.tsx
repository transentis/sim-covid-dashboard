import React, { ReactElement } from 'react';
import { VictoryChartProps, VictoryLineProps, VictoryAreaProps } from 'victory';

import { makeStyles } from '@material-ui/core/styles';

import StandardChart from './StandardChart';
import HighlightedChart from './HighlightedChart';
import { axes, lineOrArea } from '../../lib/types/data.types';
import { X } from '../../lib/constants/data.consts';

const useStyles = makeStyles(() => ({
	root: {},
	line: {},
}));

interface Props extends VictoryChartProps {
	type: lineOrArea;
	chartProps?: VictoryLineProps | VictoryAreaProps;
	highlighting?: {
		type: axes;
		areas: { start?: number; end?: number; color: string }[];
	};
}

const LineChart = (props: Props): ReactElement => {
	const classes = useStyles();
	const { highlighting, ...rest } = props;

	return !highlighting ? <StandardChart {...rest} /> : <HighlightedChart highlighting={highlighting} {...rest} />;
};

export default LineChart;

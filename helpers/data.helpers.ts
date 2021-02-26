import { MIN, MAX } from './../lib/constants/data.consts';
import { axes, min_or_max } from '../lib/types/data.types';
import { DomainPropType } from 'victory-core';
import { VictoryLineProps, VictoryAreaProps } from 'victory';

export interface RequestBody {
	scenario_managers: string[];
	scenarios: string[];
	equations: string[];
	settings: any;
}
export const requestModel = async (requestBody: RequestBody | string) => {
	const res = await fetch(`http://sim-covid-api-dev.eu-central-1.elasticbeanstalk.com/run`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(requestBody),
	});
	const responseData = await res.json();
	return responseData;
};

export const chartifyData = (data) => {
	const temp = {};
	for (const attributes in data) {
		temp[attributes] = Object.values(data[attributes]).map((value: number, index: number) => {
			return { x: index, y: value };
		});
	}
	return temp;
};

export const filterByColor = (data) => {
	const allUsedColors = [];
	const filteredArray = [];
	data.forEach((element) => {
		!allUsedColors.find((foundColor) => foundColor === element.color) && allUsedColors.push(element.color);
	});
	allUsedColors.forEach((color, index: number) => {
		filteredArray[index] = {
			color: color,
			data: data
				.filter((datum) => datum.color === color)
				.map((datum) => {
					return { x: datum.x, y: datum.y };
				}),
		};
	});
	return filteredArray;
};

export const fixStandardAreas = (
	highlighting: { type: axes; areas: { start?: number; end?: number; color: string }[] },
	standardColor: string,
	lineOrAreaProps: VictoryLineProps | VictoryAreaProps
): { start?: number; end?: number; color: string }[] => {
	const allAreas = [];
	const maximum = lineOrAreaProps.domain
		? extractDataFromDomain(lineOrAreaProps.domain, highlighting.type, MAX)
		: extractDataFromData(lineOrAreaProps.data, highlighting.type, MAX);

	for (let i = 0; i < highlighting.areas.length; i++) {
		if (i === 0) {
			!highlighting.areas[i].start && (highlighting.areas[i].start = 0);
			if (!highlighting.areas[i].end) {
				throw new Error('First Highlighting Area needs to have a sepcified end');
			}
		} else if (i === highlighting.areas.length - 1) {
			!highlighting.areas[i].end && (highlighting.areas[i].end = maximum);
			if (!highlighting.areas[i].start) {
				throw new Error('Last Highlighting Area needs to have a sepcified start');
			}
		} else {
			if (!highlighting.areas[i].start || !highlighting.areas[i].end) {
				throw new Error('Highlighting areas in the middle need to have a specified start and end');
			}
		}
	}

	for (let i = 0; i < highlighting.areas.length; i++) {
		// most left area
		if (i === 0) {
			!(highlighting.areas[i].start === 0) &&
				allAreas.push({ start: 0, end: highlighting.areas[i].start, color: standardColor });
			allAreas.push(highlighting.areas[i]);
		} // middle areas
		else if (i === highlighting.areas.length - 1) {
			!(highlighting.areas[i].start === highlighting.areas[i - 1].end) &&
				allAreas.push({
					start: highlighting.areas[i - 1].end,
					end: highlighting.areas[i].start,
					color: standardColor,
				});
			allAreas.push(highlighting.areas[i]);
		}
		// most right area
		else {
			!(highlighting.areas[i].start === highlighting.areas[i - 1].end) &&
				allAreas.push({
					start: highlighting.areas[i - 1].end,
					end: highlighting.areas[i].start,
					color: standardColor,
				});
			allAreas.push(highlighting.areas[i]);
			highlighting.areas[i].end < maximum &&
				allAreas.push({ start: highlighting.areas[i].end, end: maximum, color: standardColor });
		}
	}
	return allAreas;
};

const extractDataFromDomain = (domain: DomainPropType, axis: axes, value: min_or_max): number => {
	return Array.isArray(domain)
		? typeof domain[minMaxToNumber(value)] === 'number'
			? <number>domain[minMaxToNumber(value)]
			: (<Date>domain[minMaxToNumber(value)]).getTime()
		: typeof domain[axis][minMaxToNumber(value)] === 'number'
		? <number>domain[axis][minMaxToNumber(value)]
		: (<Date>domain[axis][minMaxToNumber(value)]).getTime();
};

const extractDataFromData = (data: any[], axis: axes, value: min_or_max): number => {
	return Math[value](
		...data.map((datum) => {
			return datum[axis];
		})
	);
};

const minMaxToNumber = (value: min_or_max): number => {
	return value === MIN ? 0 : 1;
};

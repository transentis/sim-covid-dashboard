import { MIN } from './../lib/constants/data.consts';
import { axes, min_or_max } from '../lib/types/data.types';
import { DomainPropType } from 'victory-core';

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

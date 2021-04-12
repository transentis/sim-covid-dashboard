export type x = 'x'
export type y = 'y'
export type axes = x | y

export type min = 'min'
export type max = 'max'
export type min_or_max = min | max

export type line = 'line'
export type area = 'area'
export type lineOrArea = line | area

export type stringArray = 'STRING_ARRAY'
export type numberArray = 'NUMBER_ARRAY'
export type arrayArray = 'ARRAY_ARRAY'
export type parsedType =
	| 'string'
	| 'number'
	| stringArray
	| numberArray
	| arrayArray

import { makeStyles, Checkbox, Tooltip, IconButton } from '@material-ui/core'
import { PlayArrow, Refresh } from '@material-ui/icons'
import React, { ReactElement, ReactNode, useState } from 'react'
import { Tabs } from '..'
import {
	arrayArray,
	numberArray,
	stringArray,
} from '../../lib/constants/data.consts'
import { parsedType } from '../../lib/types/data.types'
import { SingleSimpleInput } from './components'

const useStyles = makeStyles((theme) => ({
	root: {},
	simpleInput: { marginTop: '10px' },
	textField: {},
	tab: { display: 'flex', justifyContent: 'center', flexDirection: 'row' },
	block: { float: 'left', marginLeft: '15px' },
	playButton: { position: 'absolute', top: '5%', right: '15px' },
	formControl: {},
}))

interface Props {
	scheme: any
}

const Inputs = (props: Props): ReactElement => {
	const classes = useStyles()
	// copies of props scheme cuz parser methods work inplace
	const unparsedJson = Object.assign({}, props.scheme)
	const parsedJson = Object.assign({}, props.scheme)
	const simpleNumberAndstringInputs: ReactElement[] = []
	const stringArrayInputs: ReactElement[] = []
	const numberArrayInputs: ReactElement[] = []
	const blocks: ReactElement[] = []
	const tabs: ReactElement[] = []
	const maxSimpleInputsPerBlock = 4
	const maxBlocksPerTab = 4

	const parse = (parentObject: object, propKey?: string): void => {
		if (
			typeof parentObject[propKey] === 'number' ||
			typeof parentObject[propKey] === 'string'
		) {
			const component = (
				<SingleSimpleInput
					label={propKey}
					parentObj={parentObject}
					prop={propKey}
					key={simpleNumberAndstringInputs.length}
				/>
			)
			simpleNumberAndstringInputs.push(component)
			parentObject[propKey] = {
				value: parentObject[propKey],
				type: typeof parentObject[propKey],
				component: component,
			}
		} else if (Array.isArray(parentObject[propKey])) {
			if (typeof parentObject[propKey][0] === 'string') {
				parentObject[propKey] = {
					value: parentObject[propKey],
					type: stringArray,
				}
			} else if (typeof parentObject[propKey][0] === 'number') {
				parentObject[propKey] = {
					value: parentObject[propKey],
					type: numberArray,
				}
			} else if (Array.isArray(parentObject[propKey][0])) {
				parentObject[propKey] = {
					value: parentObject[propKey],
					type: arrayArray,
				}
			}
			/*else {
				parentObject[propKey] = {
					value: parentObject[propKey],
					type: 'arrayOfUnknownType',
				}
			}
			*/
		} else if (
			typeof parentObject[propKey] === 'object' &&
			Object.keys(parentObject[propKey]).length > 0
		) {
			Object.keys(parentObject[propKey]).forEach((key) =>
				parse(parentObject[propKey], key),
			)
		} else if (propKey === undefined) {
			Object.keys(parentObject).forEach((key) => parse(parentObject, key))
		}
	}
	parse(parsedJson)

	const unparse = (
		unparsedParentObject: object,
		parsedParentObject: object,
		propKey?: string,
	): void => {
		if (propKey === undefined) {
			Object.keys(unparsedParentObject).forEach((key) =>
				unparse(unparsedParentObject, parsedParentObject, key),
			)
		} else if (parsedParentObject[propKey].type) {
			unparsedParentObject[propKey] = parsedParentObject[propKey].value
		} else if (
			typeof parsedParentObject[propKey] === 'object' &&
			Object.keys(parsedParentObject[propKey]).length > 0
		) {
			Object.keys(parsedParentObject[propKey]).forEach((key) =>
				unparse(
					unparsedParentObject[propKey],
					parsedParentObject[propKey],
					key,
				),
			)
		}
	}

	// function for getting an array with all components of specified type, recursive, currently not needed
	/*
	const giveObjectsOfType = (
		type: parsedType,
		elements: ReactElement[],
		parentObj: object,
		propName?: string,
	): ReactElement[] => {
		if (propName === undefined) {
			Object.keys(parentObj).forEach((key) => {
				giveObjectsOfType(type, elements, parentObj, key)
			})
			return elements
		} else if (parentObj[propName].type) {
			if (parentObj[propName].type === type) {
				// @ts-ignore
				return elements.push(parentObj[propName].component)
			} else {
				return elements
			}
		} else {
			Object.keys(parentObj[propName]).forEach((key) => {
				giveObjectsOfType(type, elements, parentObj[propName], key)
			})
			return elements
		}
	}

	simpleNumberAndstringInputs = giveObjectsOfType(
		'number',
		[],
		parsedJson,
	).concat(giveObjectsOfType('string', [], parsedJson))

	stringArrayInputs = giveObjectsOfType(stringArray, [], parsedJson)

	numberArrayInputs = giveObjectsOfType(numberArray, [], parsedJson)
	*/

	// create blocks out of simpleInputs
	for (
		let i = 0;
		i < simpleNumberAndstringInputs.length;
		i = i + maxSimpleInputsPerBlock
	) {
		blocks.push(
			<div key={i} className={classes.block}>
				{simpleNumberAndstringInputs
					.slice(i, i + maxSimpleInputsPerBlock)
					.map((input, index: number) => {
						return input
					})}
			</div>,
		)
	}

	// create tabs out of all blocks
	for (let j = 0; j < blocks.length; j = j + maxBlocksPerTab) {
		tabs.push(
			<div className={classes.tab}>
				{blocks
					.slice(j, j + maxBlocksPerTab)
					.map((block, index: number) => {
						return block
					})}
				<div className={classes.playButton}>
					<Tooltip title={'Runs the Model with the new data'}>
						<IconButton
							onClick={() => {
								unparse(unparsedJson, parsedJson)
								console.log(unparsedJson)
							}}
							aria-label='run'
						>
							<PlayArrow />
						</IconButton>
					</Tooltip>
				</div>
			</div>,
		)
	}

	return (
		<Tabs>
			{tabs.map((tab, index: number) => {
				return <div key={index}>{tab}</div>
			})}
		</Tabs>
	)
}

export default Inputs

import { makeStyles, Typography } from '@material-ui/core'
import React, { ReactElement, useEffect, useRef } from 'react'

const useStyles = makeStyles((theme) => ({
	root: {},
}))

interface Props {
	scheme: any
}

const Inputs = (props: Props): ReactElement => {
	const classes = useStyles()
	const inputs = []

	const pushToInputs = (any: any, key: string): void => {
		if (Array.isArray(any)) {
			if (typeof any[0] === 'string' || typeof any[0] === 'number') {
				inputs.push({
					type: `${typeof any[0]}Array`,
					element: any,
					label: key,
				})
			} else {
				Array.isArray(any[0]) &&
					inputs.push({
						type: 'arrayArray',
						element: any,
						label: key,
					})
			}
		} else if (typeof any === 'string' || typeof any === 'number') {
			inputs.push({ type: typeof any, element: any, label: key })
		} else if (typeof any === 'object' && Object.keys(any).length > 0) {
			Object.keys(any).forEach((key) => pushToInputs(any[key], key))
		}
	}

	pushToInputs(props, 'props')
	console.log(inputs)

	return <Typography>Test</Typography>
}

export default Inputs

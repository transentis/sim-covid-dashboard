import { makeStyles, TextField } from '@material-ui/core'
import React, { ReactElement, ReactNode, useState } from 'react'

const useStyles = makeStyles((theme) => ({
	root: {},
	textField: {},
}))

interface Props {
	label: string
	parentObj: any
	prop: string
	key: number
}

const StringArraySelector = (props: Props): ReactElement => {
	const classes = useStyles()
	const { label, parentObj, prop, key } = props

	const handleChange = (event: any): void => {
		parentObj[prop].value =
			parentObj[prop].type === 'string'
				? event.target.value
				: parseFloat(event.target.value)
	}

	return (
		<div className={classes.root} key={key}>
			<TextField
				id={label}
				label={label}
				defaultValue={parentObj[prop].value}
				type={parentObj[prop].type}
				className={classes.textField}
				onChange={(event) => handleChange(event)}
			/>
		</div>
	)
}

export default StringArraySelector

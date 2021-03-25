import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	makeStyles,
	TextField,
} from '@material-ui/core'
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'

const useStyles = makeStyles((theme) => ({
	root: {},
	formControl: {},
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
	const status = {}
	parentObj[prop].startValue.forEach(
		(str) => (status[str] = parentObj[prop].value.includes(str)),
	)
	const [state, setState] = useState(status)

	useEffect(() => {
		const arr = []
		parentObj[prop].startValue.forEach((str) => {
			if (state[str]) {
				arr.push(str)
			}
		})
		parentObj[prop].value = arr
	}, [state])

	const handleChange = (event: any): void => {
		setState({ ...state, [event.target.name]: event.target.checked })
	}

	return (
		<div className={classes.root} key={key}>
			<FormControl component='fieldset' className={classes.formControl}>
				<FormLabel component='legend'>{label}</FormLabel>
				<FormGroup>
					{parentObj[prop].startValue.map((str) => {
						return (
							<FormControlLabel
								control={
									<Checkbox
										checked={state[str]}
										onChange={handleChange}
										name={str}
									/>
								}
								label={str}
							/>
						)
					})}
				</FormGroup>
			</FormControl>
		</div>
	)
}

export default StringArraySelector

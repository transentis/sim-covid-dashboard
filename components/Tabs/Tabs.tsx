import React, { FC, ReactNode, useState } from 'react'
import { makeStyles, Radio, Tooltip } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100%',
		width: '100%',
		position: 'relative',
	},
	tabs: {
		position: 'absolute',
		bottom: '1%',
		right: '5px',
	},
}))

interface Props {
	children: Array<ReactNode>
}

const Tabs: FC<Props> = (props) => {
	const { children } = props
	const [selectedValue, setSelectedValue] = useState(0)

	const classes = useStyles()

	const handleChange = (event) => {
		setSelectedValue(parseInt(event.target.value))
	}

	const getTabButtons = (amount) => {
		let buttons = []
		for (let i = 0; i < amount; i++) {
			buttons.push(
				<Radio
					checked={selectedValue === i}
					onChange={handleChange}
					value={i}
					key={i}
					name='radio-button'
				/>,
			)
		}
		return buttons
	}

	return (
		<div className={classes.root}>
			<Tooltip title={'Click here to change tabs'} arrow>
				<div className={classes.tabs}>
					{getTabButtons(children.length)}
				</div>
			</Tooltip>
			{children[selectedValue]}
		</div>
	)
}

export default Tabs

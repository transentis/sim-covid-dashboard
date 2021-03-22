import React, { FC, ReactNode, useState } from 'react'
import { makeStyles, Radio, Tooltip } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
	root: {},
	tabs: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'row',
	},
	tabsButtons: { position: 'absolute', bottom: 0, right: '15px' },
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
		<div>
			<div className={classes.tabs}>{children[selectedValue]}</div>
			<Tooltip title={'Click here to change tabs'} arrow>
				<div className={classes.tabsButtons}>
					{getTabButtons(children.length)}
				</div>
			</Tooltip>
		</div>
	)
}

export default Tabs

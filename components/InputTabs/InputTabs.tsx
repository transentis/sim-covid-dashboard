import React, { FC, ReactNode, useState } from 'react'

interface Props {
	children: Array<ReactNode>
}

const Tabs: FC<Props> = (props) => {
	const { children } = props
	const [selectedValue, setSelectedValue] = useState(0)

	const handleChange = (event) => {
		setSelectedValue(parseInt(event.target.value))
	}

	const getTabButtons = (amount) => {
		let buttons = []
		for (let i = 0; i < amount; i++) {
			buttons.push(
				<input
					type='radio'
					className='h-6 w-6 m-3 bg-bg'
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
		<div className='relative w-full h-full'>
			<div className='group absolute bottom-1 right-4 hover:'>
				{getTabButtons(children.length)}
			</div>
			{children[selectedValue]}
		</div>
	)
}

export default Tabs

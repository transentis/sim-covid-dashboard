import React, { FC } from 'react'
import Link from 'next/link'
import { ButtonGroup, RadioButton } from '@transentis/bptk-widgets'

interface Props {
	page?: number
}

const NavigationButtons: FC<Props> = ({ page }) => {
	return (
		<div className='prose fixed left-1/2 bottom-5 inline-flex transform -translate-x-1/2'>
			<ButtonGroup>
				<Link href='/'>
					<RadioButton checked={page === 0}>Dashboard</RadioButton>
				</Link>
				<Link href='/scenarios'>
					<RadioButton checked={page === 1}>Scenarios</RadioButton>
				</Link>
			</ButtonGroup>
		</div>
	)
}

export default NavigationButtons

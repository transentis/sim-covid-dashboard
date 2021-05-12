import React, { FC } from 'react'
import { useRouter } from 'next/router'
import {
	ButtonGroup,
	RadioButton,
	HoverMenu,
	HoverMenuItem,
} from '@transentis/bptk-widgets'

interface Props {
	page?: number
}

const NavigationButtons: FC<Props> = ({ page }) => {
	const router = useRouter()

	const handleChange = (index: number) => {
		if (index === 0) {
			router.push('/')
		} else {
			router.push('/scenarios')
		}
	}
	return (
		<HoverMenu
			className={'fixed left-1/2 bottom-12 transform -translate-x-1/2'}
			onChange={handleChange}
		>
			<HoverMenuItem name={'Dashboard'}></HoverMenuItem>
			<HoverMenuItem name={'Scenarios'}></HoverMenuItem>
		</HoverMenu>
	)
}

export default NavigationButtons

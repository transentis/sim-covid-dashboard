import React, { FC } from 'react'
import { useRouter } from 'next/router'
import { TabsButtonMenu, TabsButtonMenuItem } from '@transentis/bptk-widgets'

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
		<div className='text-base-content'>
			<TabsButtonMenu
				style='bordered'
				listClassName=''
				onChange={handleChange}
				defaultSelectedIndex={page}
			>
				<TabsButtonMenuItem name={'Dashboard'}></TabsButtonMenuItem>
				<TabsButtonMenuItem name={'Scenarios'}></TabsButtonMenuItem>
			</TabsButtonMenu>
		</div>
	)
}

export default NavigationButtons

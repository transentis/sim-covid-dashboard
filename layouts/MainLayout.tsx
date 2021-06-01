import React, { FC } from 'react'
import { NavigationButtons } from '../components'

const MainLayout: FC = ({ children }) => {
	return (
		<div className='h-full w-full'>
			{children}
			<NavigationButtons page={0} />
		</div>
	)
}

export default MainLayout

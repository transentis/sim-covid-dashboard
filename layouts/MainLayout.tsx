import React, { FC } from 'react'
import { NavigationButtons } from '../components'

const MainLayout: FC = ({ children }) => {
	return (
		<div className='min-h-screen w-full bg-bg'>
			{children}
			<NavigationButtons page={0} />
		</div>
	)
}

export default MainLayout

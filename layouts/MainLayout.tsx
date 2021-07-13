import React, { FC } from 'react'
import { NavigationButtons } from '../components'

const MainLayout: FC = ({ children }) => {
	return <div className='h-full w-full'>{children}</div>
}

export default MainLayout

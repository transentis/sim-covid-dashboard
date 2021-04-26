import React, { FC } from 'react'
import Link from 'next/link'

const NavigationButtons: FC = () => {
	return (
		<div className='prose absolute inset-x-1/2 bottom-5 inline-flex transform -translate-x-1/2'>
			<Link href='/'>
				<button className='bg-purple-600 hover:bg-purple-700 text-gray-800 font-bold py-2 px-4 rounded-l'>
					Dashboard
				</button>
			</Link>
			<Link href='/scenarios'>
				<button className='bg-purple-600 hover:bg-purple-700 text-gray-800 font-bold py-2 px-4 rounded-r'>
					Scenarios
				</button>
			</Link>
		</div>
	)
}

export default NavigationButtons

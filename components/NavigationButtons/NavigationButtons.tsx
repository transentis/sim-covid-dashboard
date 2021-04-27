import React, { FC } from 'react'
import Link from 'next/link'

const NavigationButtons: FC = () => {
	return (
		<div className='prose fixed left-1/2 bottom-5 inline-flex transform -translate-x-1/2'>
			<Link href='/'>
				<button className='bg-cyan hover:bg-cyan-dark text-gray-800 font-bold py-2 px-4 rounded-l'>
					Dashboard
				</button>
			</Link>
			<Link href='/scenarios'>
				<button className='bg-cyan hover:bg-cyan-dark text-gray-800 font-bold py-2 px-4 rounded-r'>
					Scenarios
				</button>
			</Link>
		</div>
	)
}

export default NavigationButtons

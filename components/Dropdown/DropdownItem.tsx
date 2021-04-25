import React, { FC } from 'react'

export interface DropdownItemsI {
	color?: string
	name: string
	onClick?: () => void
}
const DropdownItems: FC<DropdownItemsI> = ({
	color = 'white',
	onClick,
	name,
}) => {
	return (
		<a
			onClick={onClick}
			className={
				'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent cursor-pointer ' +
				(color === 'white' ? ' text-blueGray-700' : 'text-white')
			}
		>
			{name}
		</a>
	)
}

export default DropdownItems

import React, { createRef, FC, useState, ReactElement } from 'react'
import { createPopper } from '@popperjs/core'
import { DropdownItemsI } from './DropdownItem'

interface Props {
	color: string
	name?: string
	children: ReactElement<DropdownItemsI>[]
}
const Dropdown: FC<Props> = ({ color, children, name }) => {
	const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false)

	const btnDropdownRef = createRef<HTMLButtonElement>()
	const popoverDropdownRef = createRef<HTMLDivElement>()

	const openDropdownPopover = () => {
		createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
			placement: 'bottom-start',
		})
		setDropdownPopoverShow(true)
	}
	const closeDropdownPopover = () => {
		setDropdownPopoverShow(false)
	}

	let bgColor: string

	color === 'white'
		? (bgColor = 'bg-blueGray-700')
		: (bgColor = 'bg-' + color + '-500')
	return (
		<>
			<div className='flex flex-wrap'>
				<div className='w-full sm:w-6/12 md:w-4/12 px-4'>
					<div className='relative inline-flex align-middle w-full'>
						<button
							className={
								'prose font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ' +
								bgColor
							}
							type='button'
							ref={btnDropdownRef}
							onClick={() => {
								dropdownPopoverShow
									? closeDropdownPopover()
									: openDropdownPopover()
							}}
						>
							{name}
						</button>
						<div
							ref={popoverDropdownRef}
							className={
								(dropdownPopoverShow ? 'block ' : 'hidden ') +
								(color === 'white'
									? 'bg-white '
									: bgColor + ' ') +
								'text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1'
							}
							style={{ minWidth: '12rem' }}
						>
							{children}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Dropdown

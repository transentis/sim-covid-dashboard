import React from 'react'
import { Backdrop, CircularProgress } from '@material-ui/core'

interface Props {
	loading: boolean
}

export default function LoadingOverlay(props: Props) {
	return (
		<Backdrop className='z-1' open={props.loading}>
			<CircularProgress color='inherit' />
		</Backdrop>
	)
}

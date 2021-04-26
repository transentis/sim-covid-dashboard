import { Opacity } from '@material-ui/icons'
import { ReactElement, ReactNode } from 'react'

const Paper = (props: { children: ReactNode }): ReactElement => {
	const { children, ...rest } = props
	return <div {...rest}>{children}</div>
}

export default Paper

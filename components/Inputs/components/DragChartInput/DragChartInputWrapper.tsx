import React, { ReactElement, useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import classes from '*.module.css'
import { Button, makeStyles } from '@material-ui/core'
import DragChartInputChart from './DragChartInputChart'

const useStyles = makeStyles((theme) => ({
	root: {},
	buttons: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'row',
	},
	button: { margin: '5px' },
}))

interface Props {
	parentObj: any
	prop: string
	height: number
	width: number
	margin: any
	colorTheme: any
	maxValue?: number
	xSteps?: number
	onChangeData: (
		data: Array<number>,
		tupleData: Array<[number, number]>,
	) => void
}

const DragChartInputWrapper = (props: Props) => {
	const classes = useStyles()
	const { parentObj, prop } = props

	const [data, setData] = useState(parentObj[prop].value)

	const Chart = (): ReactElement => {
		return <DragChartInputChart data={data} {...props} />
	}

	const Buttons = (): ReactElement => {
		return (
			<div className={classes.buttons}>
				<Button
					className={classes.button}
					variant='contained'
					onClick={() => addNodes(1)}
				>
					+1
				</Button>
				<Button
					className={classes.button}
					variant='contained'
					onClick={() => addNodes(5)}
				>
					+5
				</Button>
				<Button
					className={classes.button}
					variant='contained'
					onClick={() => removeNodes(1)}
				>
					-1
				</Button>
				<Button
					className={classes.button}
					variant='contained'
					onClick={() => removeNodes(5)}
				>
					-5
				</Button>
			</div>
		)
	}

	const addNodes = (amount: number): void => {
		const newData = [...data]
		for (let i = 0; i < amount; i++) {
			newData.push(newData[newData.length - 1])
		}
		setData(newData)
	}

	const removeNodes = (amount: number): void => {
		let newData = data
		if (amount >= data.length) {
			newData = [newData[0]]
		} else {
			newData = newData.splice(0, newData.length - amount)
		}
		setData(newData)
	}

	return (
		<div>
			<Chart />
			<Buttons />
		</div>
	)
}

export default DragChartInputWrapper

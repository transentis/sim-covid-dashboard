import React, { ReactNode, useState } from 'react'
import Head from 'next/head'

import {
	Box,
	Button,
	Divider,
	makeStyles,
	Paper,
	Typography,
} from '@material-ui/core/'
import { Chart, JsonInput, LoadingOverlay } from '../components'
import { VictoryTheme } from 'victory'
import { AREA, LINE, X, Y } from '../lib/constants/data.consts'

import RestoreIcon from '@material-ui/icons/Restore'
import FavoriteIcon from '@material-ui/icons/Favorite'
import LocationOnIcon from '@material-ui/icons/LocationOn'

import BPTKApi from '../lib/apiMiddlewear'

const bptkApi = new BPTKApi('YOUR API KEY')

const useStyles = makeStyles((theme) => ({
	root: {
		paddingBottom: theme.spacing(4),
	},
	bottomNavigation: {
		width: 500,
	},
}))

interface Props {
	data: {
		contact_rate: [{ x: number; y: number; fill: string }]
		reproduction_rate: [{ x: number; y: number }]
	}
}

const Home = (props: Props) => {
	const { data } = props

	const [graphData, setGraphData] = useState<{}>(data)

	const [requestBody, setRequestBody] = useState('')

	const requestData = async () => {
		let requestedData
		if (requestBody !== '') {
			requestedData = await bptkApi.requestModel(requestBody)
		}

		if (!requestedData) {
			return
		}

		const data = bptkApi.chartifyData(requestedData)

		setGraphData(data)
	}

	const onNewJsonInput = (input) => {
		setRequestBody(input.jsObject)
	}

	const createGraphs = (data: any): ReactNode[] => {
		let graphs: ReactNode[] = []
		Object.keys(graphData).forEach((name: string, index: number) => {
			graphs.push(
				<Paper key={index} style={{ margin: '2rem', padding: '2rem' }}>
					<Typography variant='h4' align='center'>
						{name.toUpperCase()}
					</Typography>
					<Chart
						type={AREA}
						theme={VictoryTheme.material}
						chartProps={{
							animate: {
								duration: 2000,
								onLoad: { duration: 1000 },
							},
							data: data[name],
						}}
						highlighting={{
							type: X,
							areas: [
								{ end: 200, color: '#e9c46a' },
								{ start: 300, end: 400, color: '#f4a261' },
								{ start: 500, color: '#e76f51' },
							],
						}}
						// domain={{ x: [0, 600], y: [0, 600] }}
					></Chart>
				</Paper>
			)
		})
		return graphs
	}

	const classes = useStyles()

	return (
		<>
			<Box className={classes.root}>
				<Head>
					<title>BPTK Widgets</title>
					<link rel='icon' href='/favicon.ico' />
				</Head>

				<main>
					<LoadingOverlay loading={false}></LoadingOverlay>
					<Box width='100%'>
						<Typography variant='h1' align='center'>
							Cool Dashboard
						</Typography>
					</Box>
					<Divider></Divider>
					<Box
						display='flex'
						justifyContent='center'
						flexDirection='column'
					>
						<Box
							display='flex'
							justifyContent='center'
							flexWrap='wrap'
							flexDirection='row'
						>
							{createGraphs(data)}
						</Box>
						<Divider></Divider>
						<Box display='flex' flexDirection='column'>
							<JsonInput onChange={onNewJsonInput}></JsonInput>
						</Box>
						<Box
							display='grid'
							gridGap='1rem'
							gridAutoFlow='column'
							justifyContent='center'
							alignItems='center'
							marginTop={'2rem'}
						>
							<Button
								variant='contained'
								onClick={() => requestData()}
							>
								Load Data
							</Button>
							<Button
								variant='contained'
								onClick={() => window.location.reload()}
							>
								Refresh
							</Button>
						</Box>
					</Box>
				</main>
			</Box>
		</>
	)
}

export const getStaticProps = async () => {
	const requestBody = {
		scenario_managers: ['smSir'],
		scenarios: ['dashboard'],
		equations: ['contact_rate', 'reproduction_rate', 'population'],
		settings: {
			smSir: {
				dashboard: {
					constants: {
						normal_contact_rate: 20.0,
						distancing_contact_rate: 5.0,
						distancing_begin: 50.0,
						distancing_duration: 500.0,
						distancing_on: 0.0,
						dashboard_on: 1.0,
					},
				},
			},
		},
	}

	const requestedData = await bptkApi.requestModel(requestBody)

	if (!requestedData) {
		return {
			notFound: true,
		}
	}

	const data = bptkApi.chartifyData(requestedData)

	return {
		props: {
			data: data,
		},
	}
}

export default Home

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
import { AREA } from '../lib/constants/data.consts'

import BPTKApi from '../lib/apiMiddlewear'
import Inputs from '../components/Inputs'

const bptkApi = new BPTKApi('YOUR API KEY')

const useStyles = makeStyles((theme) => ({
	root: {
		paddingBottom: theme.spacing(4),
	},
	bottomNavigation: {
		width: 500,
	},
	divider: {
		margin: '15px',
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
		let requestedData: any
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

						// domain={{ x: [0, 600], y: [0, 600] }}
					></Chart>
				</Paper>,
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
					<Divider className={classes.divider} />
					<Box
						position='relative'
						display='flex'
						justifyContent='center'
						flexDirection='column'
					>
						<Inputs
							scheme={{
								scenarios: ['dashboard'],
								equations: [
									'contact_rate',
									'reproduction_rate',
									'total_population',
								],
								normal_contact_rate: [20, 20, 20],
								distancing_contact_rate: 5.0,
								distancing_begin: 50.0,
								distancing_duration: 500.0,
								distancing_on: 0.0,
								dashboard_on: 1.0,
								numberVar1: 5.0,
								numberVar2: 50.0,
								numberVar3: 50.0,
								numberVar4: 50.0,
								numberVar5: 50.0,
								numberVar6: 50.0,
								numberVar7: 50.0,
								numberVar8: 50.0,
								numberVar9: 50.0,
								numberVar10: 50.0,
								numberVar11: 50.0,
								numberVar12: 50.0,
								numberVar13: 50.0,
								stringVar1: 'negative',
								stringVar2: 'negative',
								stringVar3: 'negative',
							}}
						/>
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

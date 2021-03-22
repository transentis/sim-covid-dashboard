import React, { useState } from 'react'
import Head from 'next/head'

import {
	Box,
	Button,
	ButtonGroup,
	Grid,
	makeStyles,
	Paper,
	Typography,
} from '@material-ui/core/'
import { Chart, LoadingOverlay } from '../components'
import { VictoryTheme } from 'victory'
import { AREA, LINE, X } from '../lib/constants/data.consts'

import Inputs from '../components/Inputs'

import BPTKApi from '@transentis/bptk-connector'

const useStyles = makeStyles((theme) => ({
	root: {
		paddingBottom: theme.spacing(4),
	},
	bottomNavigation: {
		width: 500,
	},
}))

const bptkApi = new BPTKApi('MY API KEY')

const defaultModel = {
	scenario_managers: ['smSir'],
	scenarios: ['dashboard'],
	equations: [
		'normal_contact_rate',
		'distancing_contact_rate',
		'infectious',
		'total_population',
		'recovered',
		'deceased',
	],
	settings: {
		smSir: {
			dashboard: {
				constants: {
					distancing_contact_rate: 5.0,
					distancing_on: 0.0,
					dashboard_on: 0.0,
				},
				points: {
					variable_contact_rate: [
						[0, 20.0],
						[1500, 20.0],
					],
				},
			},
		},
	},
}

interface Props {
	data: {
		contact_rate: [{ x: number; y: number }]
		reproduction_rate: [{ x: number; y: number }]
		total_population: [{ x: number; y: number }]
	}
}

const Home = (props: Props) => {
	const { data } = props

	const classes = useStyles()

	const graphs = ['total_population', 'normal_contact_rate', 'infectious']

	const [loading, setLoading] = useState(false)

	const [selectedGraph, setSelectedGraph] = useState<string>(graphs[0])
	const [graphData, setGraphData] = useState<any>(data)

	const [dragChartData, setDragChartData] = useState([
		20,
		20,
		20,
		20,
		20,
		20,
		20,
		20,
		20,
		20,
		20,
		20,
		20,
		20,
		20,
		20,
	])

	const [requestBody, setRequestBody] = useState(defaultModel)

	const requestData = async () => {
		let requestedData: any
		requestedData = await bptkApi.requestModel(requestBody)

		console.log(requestedData)

		if (!requestedData) {
			return
		}

		setGraphData(bptkApi.chartifyData(requestedData))
	}

	const handleGraphChange = (index: number) => {
		setSelectedGraph(graphs[index])
	}

	return (
		<>
			<Box className={classes.root}>
				<Head>
					<title>Covid Dashboard</title>
					<link rel='icon' href='/favicon.ico' />
				</Head>
				<LoadingOverlay loading={loading}></LoadingOverlay>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Paper>
							<Box padding={1}>
								<Typography variant='h1' align='center'>
									Covid Dashboard
								</Typography>
							</Box>
						</Paper>
					</Grid>
					<Grid item xs={8}>
						<Paper>
							<Box
								height={'100px'}
								display='flex'
								justifyContent='center'
								alignItems='center'
							>
								<ButtonGroup>
									<Button
										onClick={() => handleGraphChange(0)}
									>
										Population
									</Button>
									<Button
										onClick={() => handleGraphChange(1)}
									>
										Intensive Care
									</Button>
									<Button
										onClick={() => handleGraphChange(2)}
									>
										Indicators
									</Button>
								</ButtonGroup>
							</Box>
						</Paper>
					</Grid>
					<Grid item xs={4}>
						<Paper>
							<Box
								height={'100px'}
								display='flex'
								justifyContent='center'
								alignItems='center'
							>
								<Typography variant='h3'>
									Assumptions
								</Typography>
							</Box>
						</Paper>
					</Grid>
					<Grid item xs={8}>
						<Paper>
							<Box padding={3} height={'500px'}>
								<Typography variant='h4' align='center'>
									{selectedGraph
										.toUpperCase()
										.replace('_', ' ')}
								</Typography>
								<Chart
									type={AREA}
									theme={VictoryTheme.material}
									chartProps={{
										animate: {
											duration: 2000,
											onLoad: { duration: 1000 },
										},
										data: graphData[selectedGraph],
									}}
								></Chart>
							</Box>
						</Paper>
					</Grid>
					<Grid item xs={4}>
						<Paper>
							<Box padding={3} height={'500px'}>
								<Typography>
									The implementation here is roughly
									calibrated to the current situation in
									Germany (as of 27.3.2020). It illustrates
									the effects of social distancing in
									achieving the objective of keeping the
									strain on the health care system as small as
									possible.
									<br />
									<ul>
										<li>
											<b>Contact Rate:</b> 20 persons.
											Defines how many people a person
											encounters per day in average.
										</li>
										<li>
											<b>Infectivity:</b> 2%. Defines the
											probability that a person becomes
											infected after contact with an
											infectious person.
										</li>
										<li>
											<b>Duration.</b> Defines how long an
											infective person remains contagious
										</li>
										<li>
											<b>Population.</b> The susceptible
											population starts at 80 Mio., the
											infectious population starts at 120
											persons.
										</li>
										<li>
											<b>Intensive Care Needed:</b> 0.2%.
											Measures the number of infected
											people who need intensive care.
										</li>
										<li>
											<b>Intensive Care Available:</b>{' '}
											30,000 units. The number of
											intensive care units available.
										</li>
									</ul>
									With the above settings, this means we have
									a contact number of 8 in the base settings.
									The contact number is the product of contact
									rate, infectivity and duration.
								</Typography>
							</Box>
						</Paper>
					</Grid>
					<Grid item xs={8}>
						<Paper>
							<Box
								height={'300px'}
								padding={3}
								position='relative'
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
										stringVar4: 'negative',
										stringVar5: 'negative',
										stringVar6: 'negative',
									}}
								/>
							</Box>
						</Paper>
					</Grid>
					<Grid item xs={4}>
						<Paper>
							<Box
								height={'300px'}
								padding={3}
								width='100%'
							></Box>
						</Paper>
					</Grid>
				</Grid>
			</Box>
		</>
	)
}

export const getStaticProps = async () => {
	const requestedData = await bptkApi.requestModel(defaultModel)

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

import React, { ReactNode, useState } from 'react'
import Head from 'next/head'

import {
	Box,
	Button,
	ButtonGroup,
	Grid,
	IconButton,
	makeStyles,
	Paper,
	Slider,
	Tooltip,
	Typography,
	Tabs,
	Tab,
} from '@material-ui/core/'
import { DragChart, LoadingOverlay } from '../components'
import { VictoryTheme } from 'victory'

import ReactResizeDetector from 'react-resize-detector'

import { PlayArrow, Refresh } from '@material-ui/icons'

import BPTKApi from '@transentis/bptk-connector'
import Chart from '@transentis/bptk-widgets/'

const useStyles = makeStyles((theme) => ({
	root: {
		paddingBottom: theme.spacing(4),
	},
	main: {
		overflow: 'hidden',
	},
	tabs: {
		marginBottom: '10px',
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
		'total_population',
		'contact_rate',
		'infectious',
		'recovered',
		'deceased',
		'intensive_needed',
		'intensive_available',
	],
	settings: {
		smSir: {
			dashboard: {
				constants: {},
				points: {
					contact_rate_table: [
						[0, 20],
						[100, 20],
						[200, 20],
						[300, 20],
						[400, 20],
						[500, 20],
						[600, 20],
						[700, 20],
						[800, 20],
						[900, 20],
						[1000, 20],
						[1100, 20],
						[1200, 20],
						[1300, 20],
						[1400, 20],
						[1500, 20],
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

	const graphs = [
		['total_population'],
		['intensive_needed', 'intensive_available'],
		['recovered', 'deceased'],
		['contact_rate'],
		['infectious'],
	]

	const [selectedTab, setSelectedTab] = useState(0)
	const [loading, setLoading] = useState(false)
	const [rangeSliderRange, setRangeSliderRange] = useState<number[]>([
		0,
		1499,
	])
	const [selectedGraph, setSelectedGraph] = useState<Array<string>>(graphs[0])
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

		if (!requestedData) {
			return
		}

		setGraphData(bptkApi.chartifyData(requestedData))
	}

	const handleSliderChange = (event: any, newValue: number | number[]) => {
		setRangeSliderRange(newValue as number[])
	}

	const handleGraphChange = (index: number) => {
		setSelectedGraph(graphs[index])
	}

	const handleSelectTab = (event: any, index: number): void => {
		setSelectedTab(index)
	}

	const TabPanel = (props: {
		children?: ReactNode
		index: any
		value: any
	}) => {
		const { children, value, index, ...other } = props

		return (
			<div
				role='tabpanel'
				hidden={value !== index}
				id={`simple-tabpanel-${index}`}
				aria-labelledby={`simple-tab-${index}`}
				{...other}
			>
				{value === index && <Typography>{children}</Typography>}
			</div>
		)
	}
	console.log(data)
	return (
		<>
			<Box className={classes.root}>
				<Head>
					<title>COVID-19 Simulation</title>
					<link rel='icon' href='/favicon.ico' />
				</Head>
				<LoadingOverlay loading={loading}></LoadingOverlay>
				<div className={classes.main}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Paper>
								<Box padding={1}>
									<Typography variant='h1' align='center'>
										COVID-19 Simulation
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
											Extensive Care
										</Button>
										<Button
											onClick={() => handleGraphChange(2)}
										>
											Indicators
										</Button>
										<Button
											onClick={() => handleGraphChange(3)}
										>
											Contact Rate
										</Button>
										<Button
											onClick={() => handleGraphChange(4)}
										>
											Assumptions
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
								></Box>
							</Paper>
						</Grid>
						<Grid item xs={8}>
							<Paper>
								<Box
									padding={2}
									height={'600px'}
									position='relative'
									display='flex'
									alignItems='center'
									flexDirection='column'
								>
									<Typography variant='h4' align='center'>
										{selectedGraph[0]
											.toUpperCase()
											.replace('_', ' ')}
									</Typography>

									<Chart
										type={'AREA'}
										theme={VictoryTheme.material}
										chartProps={{
											animate: {
												duration: 2000,
												onLoad: {
													duration: 1000,
												},
											},
											data: [
												...selectedGraph.map(
													(graphName) =>
														graphData[
															graphName
														].slice(
															rangeSliderRange[0],
															rangeSliderRange[1],
														),
												),
											],
										}}
										size={{
											width: 1200,
											height: 450,
										}}
										labeling={{
											x: 'days after pandemic outbreak',
											y: 'population',
										}}
									></Chart>

									<Box width='100%'>
										<Typography gutterBottom>
											Visualization Range
										</Typography>
										<Slider
											value={rangeSliderRange}
											onChange={handleSliderChange}
											valueLabelDisplay='auto'
											min={0}
											max={1499}
										/>
									</Box>
								</Box>
							</Paper>
						</Grid>
						<Grid item xs={4}>
							<Paper>
								<Box
									padding={3}
									height={'600px'}
									position='relative'
								>
									<Tabs
										value={selectedTab}
										onChange={handleSelectTab}
										indicatorColor='primary'
										textColor='primary'
										className={classes.tabs}
										centered
									>
										<Tab label='intro' id='intro' />
										<Tab
											label='assumptions'
											id='assumptions'
										/>
									</Tabs>
									<TabPanel value={selectedTab} index={0}>
										Whenever you need to make predictions
										about complex situations you have little
										prior experience with, models and
										simulations are a good starting point to
										explore the situation and to make
										qualitative and quantitative predictions
										about how the situation may develop.
										Play with our COVID-19 simulation and
										see how social distancing can slow the
										spreading of the virus.
									</TabPanel>
									<TabPanel value={selectedTab} index={1}>
										The implementation here is roughly
										calibrated to the situation in Germany
										at the beginning of the pandemic, around
										the end of March 2020. It illustrates
										the effects of social distancing in
										achieving the objective of keeping the
										strain on the health care system as
										small as possible.
										<br />
										<ul>
											<li>
												<b>Contact Rate:</b> 20 persons.
												Defines how many people a person
												encounters per day in average.
											</li>
											<li>
												<b>Infectivity:</b> 2%. Defines
												the probability that a person
												becomes infected after contact
												with an infectious person.
											</li>
											<li>
												<b>Duration.</b> Defines how
												long an infective person remains
												contagious
											</li>
											<li>
												<b>Population.</b> The
												susceptible population starts at
												80 Mio., the infectious
												population starts at 120
												persons.
											</li>
											<li>
												<b>Intensive Care Needed:</b>{' '}
												0.2%. Measures the number of
												infected people who need
												intensive care.
											</li>
											<li>
												<b>Intensive Care Available:</b>{' '}
												30,000 units. The number of
												intensive care units available.
											</li>
										</ul>
										With the above settings, this means we
										have a contact number of 8 in the base
										settings. The contact number is the
										product of contact rate, infectivity and
										duration.
									</TabPanel>
								</Box>
							</Paper>
						</Grid>
						<Grid item xs={8}>
							<Paper>
								<Box
									height={'200px'}
									padding={3}
									position='relative'
								>
									<div
										style={{
											marginLeft: '10px',
										}}
									>
										<div
											style={{
												position: 'absolute',
												right: '1%',
											}}
										>
											<Tooltip
												title={'Resets the dragchart'}
											>
												<IconButton
													// onClick={() =>
													// 	// resetDragData()
													// }
													aria-label='delete'
												>
													<Refresh />
												</IconButton>
											</Tooltip>

											<Tooltip
												title={
													'Runs the Model with the new dragchart data'
												}
											>
												<IconButton
													onClick={() =>
														requestData()
													}
													aria-label='run'
												>
													<PlayArrow />
												</IconButton>
											</Tooltip>
										</div>
										<Typography>Contact Rate</Typography>
										<ReactResizeDetector handleWidth>
											{({ width }) => (
												<Box>
													<DragChart
														data={dragChartData}
														colorTheme={[
															'#6aedc7',
															'#5ce6be',
														]}
														onChangeData={(
															newData,
															tupleData,
														) => {
															setRequestBody({
																...requestBody,
																settings: {
																	smSir: {
																		dashboard: {
																			constants: {
																				...requestBody
																					.settings
																					.smSir
																					.dashboard
																					.constants,
																			},
																			points: {
																				contact_rate_table: tupleData,
																			},
																		},
																	},
																},
															})
															setDragChartData(
																newData,
															)
														}}
														width={
															width
																? width - 50
																: 100
														}
														height={100}
														margin={{
															top: 20,
															right: 20,
															bottom: -20,
															left: 20,
														}}
														maxValue={40}
														xSteps={100}
													/>
												</Box>
											)}
										</ReactResizeDetector>
									</div>
								</Box>
							</Paper>
						</Grid>
						<Grid item xs={4}>
							<Paper>
								<Box
									height={'200px'}
									padding={3}
									width='100%'
								></Box>
							</Paper>
						</Grid>
					</Grid>
				</div>
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

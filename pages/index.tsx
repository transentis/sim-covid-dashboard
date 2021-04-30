import React, { ReactElement, ReactNode, useState } from 'react'
import Head from 'next/head'

import { IconButton, Slider, Tooltip, Tabs, Tab } from '@material-ui/core/'
import { LoadingOverlay, NavigationButtons, Paper } from '../components'

import ReactResizeDetector from 'react-resize-detector'

import { PlayArrow, Refresh } from '@material-ui/icons'

import BPTKApi from '@transentis/bptk-connector'
import { Chart, DragComponent } from '@transentis/bptk-widgets'

import { theme } from '../lib/constants/covid.dashboard.theme'
import { transentisColors as tc } from '../lib/constants/colors'

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

	console.log(data)

	const graphs = [
		['total_population'],
		['intensive_needed', 'intensive_available'],
		['recovered', 'deceased'],
		['contact_rate'],
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
				className='p-4'
				role='tabpanel'
				hidden={value !== index}
				id={`simple-tabpanel-${index}`}
				aria-labelledby={`simple-tab-${index}`}
				{...other}
			>
				{value === index && (
					<p className='prose text-base'>{children}</p>
				)}
			</div>
		)
	}

	const EquationButton = (props: {
		children: ReactNode
		onClick: () => void
		first?: boolean
		last?: boolean
	}): ReactElement => {
		const { children, onClick, first, last } = props
		let css = 'uppercase border border-white p-3 text-xs lg:text-sm'

		first && (css += ' lg:rounded-l')
		last && (css += ' lg:rounded-r')

		return (
			<button className={css} onClick={onClick}>
				{children}
			</button>
		)
	}
	// console.log(data)

	return (
		<div className='min-h-screen w-full bg-bg'>
			<Head>
				<title>COVID-19 Simulation</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LoadingOverlay loading={loading}></LoadingOverlay>
			<div className='overflow-hidden bg-bg h-full'>
				<div className='grid gap-4 p-3 grid-cols-2 lg:grid-cols-3 h-full'>
					<div className='col-span-2 lg:col-span-3'>
						<Paper className='bg-bg-paper w-full h-full rounded flex flex-col justify-center items-center'>
							<div className=''>
								<p className='text-5xl lg:text-7xl p-4'>
									COVID-19 Simulation
								</p>
							</div>
						</Paper>
					</div>
					<div className='col-span-2'>
						<Paper className='bg-bg-paper w-full h-full rounded flex flex-col justify-center items-center'>
							<div className='p-4'>
								<EquationButton
									onClick={() => handleGraphChange(0)}
									first
								>
									Population
								</EquationButton>
								<EquationButton
									onClick={() => handleGraphChange(1)}
								>
									Intensive Care
								</EquationButton>
								<EquationButton
									onClick={() => handleGraphChange(2)}
								>
									Indicators
								</EquationButton>
								<EquationButton
									onClick={() => handleGraphChange(3)}
								>
									Contact Rate
								</EquationButton>
							</div>
						</Paper>
					</div>
					<div className='col-span-2 hidden lg:flex lg:col-span-1'>
						<Paper className='bg-bg-paper w-full h-full rounded'>
							<div></div>
						</Paper>
					</div>
					<div className='col-span-2'>
						<Paper className='bg-bg-paper w-full h-full rounded'>
							<div className='flex flex-col justify-center items-center'>
								<p className='text-3xl lg:text-4xl p-4'>
									{selectedGraph[0]
										.toUpperCase()
										.replace('_', ' ')}
								</p>
								<div className='p-2'>
									<Chart
										type={'AREA'}
										theme={theme}
										colorPalette={[
											tc.cyan.default,
											tc.orange.default,
											tc.cyan.light,
											tc.orange.light,
											tc.cyan.dark,
											tc.orange.dark,
										]}
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
										legend={{
											outline: 'none',
											names: [
												...selectedGraph.map(
													(graphName) => {
														return {
															name: graphName,
														}
													},
												),
											],
											x: 900,
											y: 300,
										}}
									></Chart>
								</div>
								<div className='w-11/12 p-2'>
									<p className=''>Visualization Range</p>
									<Slider
										value={rangeSliderRange}
										onChange={handleSliderChange}
										valueLabelDisplay='auto'
										min={0}
										max={1499}
									/>
								</div>
							</div>
						</Paper>
					</div>
					<div className='col-span-2 lg:col-span-1'>
						<Paper className='bg-bg-paper w-full h-full rounded'>
							<div className='p-3'>
								<Tabs
									value={selectedTab}
									onChange={handleSelectTab}
									indicatorColor='primary'
									textColor='inherit'
									className='m-3'
									centered
								>
									<Tab
										className='focus:outline-none'
										label='intro'
										id='intro'
									/>
									<Tab
										className='focus:outline-none'
										label='assumptions'
										id='assumptions'
									/>
								</Tabs>
								<TabPanel value={selectedTab} index={0}>
									Whenever you need to make predictions about
									complex situations you have little prior
									experience with, models and simulations are
									a good starting point to explore the
									situation and to make qualitative and
									quantitative predictions about how the
									situation may develop. Play with our
									COVID-19 simulation and see how social
									distancing can slow the spreading of the
									virus.
								</TabPanel>
								<TabPanel value={selectedTab} index={1}>
									The implementation here is roughly
									calibrated to the situation in Germany at
									the beginning of the pandemic, around the
									end of March 2020. It illustrates the
									effects of social distancing in achieving
									the objective of keeping the strain on the
									health care system as small as possible.
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
								</TabPanel>
							</div>
						</Paper>
					</div>
					<div className='col-span-2'>
						<Paper className='bg-bg-paper w-full h-full rounded flex flex-col justify-center'>
							<div className='relative m-2 p-3'>
								<div className='absolute right-2 top-2'>
									<Tooltip title={'Resets the dragchart'}>
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
											onClick={() => requestData()}
											aria-label='run'
										>
											<PlayArrow />
										</IconButton>
									</Tooltip>
								</div>
								<p className=''>Contact Rate</p>
								<ReactResizeDetector handleWidth>
									{({ width }) => (
										<div className='w-11/12'>
											<DragComponent
												data={dragChartData}
												colorTheme={[
													tc.cyan.default,
													tc.orange.default,
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
													setDragChartData(newData)
												}}
												width={width ? width - 50 : 100}
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
										</div>
									)}
								</ReactResizeDetector>
							</div>
						</Paper>
					</div>
					<div className='col-span-2 hidden lg:flex lg:col-span-1'>
						<Paper className='bg-bg-paper w-full h-full rounded'>
							<div></div>
						</Paper>
					</div>
				</div>
			</div>
			<NavigationButtons />
		</div>
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

import React, { useState } from 'react'
import Head from 'next/head'

import { IconButton, Tooltip } from '@material-ui/core/'

import { PlayArrow, Refresh } from '@material-ui/icons'

import BPTKApi from '@transentis/bptk-connector'
import {
	RadioButton,
	ButtonGroup,
	Chart,
	DragComponent,
	StandardGridLayout,
	Tabs,
	DefaultGraphColors,
	DoubleRangeSlider as Slider,
	ThemeSwitcher,
	DefaultChartTheme,
} from '@transentis/bptk-widgets'

import { equations } from '../lib/equations.tabs.map'
import { defaultModel } from '../lib/btpk.models'

const bptkApi = new BPTKApi({
	backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
	apiKey: 'MY API KEY',
	trailingSlash: false,
})

const defaultDragComponentState = [
	20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
]

interface Props {
	data: any
}

const Home = (props: Props) => {
	console.log(process.env.NEXT_PUBLIC_BACKEND_URL)

	const { data } = props

	const graphs = [
		equations.population,
		equations.intensiveCare,
		equations.indicators,
		equations.contact_rate,
	]

	// Range for the slider for the graph
	const [rangeSliderRange, setRangeSliderRange] = useState<number[]>([
		0, 1499,
	])

	// Selected Graph
	const [selectedGraph, setSelectedGraph] = useState<{
		name: string
		equations: Array<string>
	}>(graphs[0])
	const [graphData, setGraphData] = useState<any>(data)

	const [requestBody, setRequestBody] = useState(defaultModel())

	const requestData = async () => {
		let requestedData: any
		requestedData = await bptkApi.requestModel(requestBody)

		if (!requestedData) {
			return
		}

		setGraphData(bptkApi.chartifyData(requestedData))
	}

	const handleSliderChange = (newValue: number[]) => {
		setRangeSliderRange(newValue as number[])
	}

	const handleGraphChange = (index: number) => {
		setSelectedGraph(graphs[index])
	}

	return (
		<div className='text-base-content'>
			<Head>
				<title>COVID-19 Simulation</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div className='overflow-hidden h-full'>
				<StandardGridLayout
					dashboardTitle={'COVID-19 Simulation'}
					graphTabsComponent={
						<ButtonGroup>
							{graphs.map((mapEquatios, index) => (
								<RadioButton
									onClick={() => handleGraphChange(index)}
									checked={index === 0}
								>
									{mapEquatios.name}
								</RadioButton>
							))}
						</ButtonGroup>
					}
					titleSidePanelComponent={
						<div>
							<ThemeSwitcher
								themes={['transentisDark', 'transentisLight']}
							/>
						</div>
					}
					graphTitle={selectedGraph.name
						.toUpperCase()
						.replace('_', ' ')}
					graphComponent={
						<Chart
							type={'AREA'}
							theme={DefaultChartTheme}
							colorPalette={DefaultGraphColors}
							chartProps={{
								animate: {
									duration: 2000,
									onLoad: {
										duration: 1000,
									},
								},
								data: [
									...selectedGraph.equations.map(
										(graphName) =>
											graphData[graphName].slice(
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
									...selectedGraph.equations.map(
										(graphName) => {
											return {
												name: graphName,
											}
										},
									),
								],
								x: 900,
								y: 250,
							}}
						></Chart>
					}
					graphSettingComponent={
						<>
							<p className=''>Visualization Range</p>
							<Slider
								onChange={handleSliderChange}
								min={0}
								max={1499}
								startMin={0}
								startMax={1499}
							/>
						</>
					}
					sidePanelComponent={
						<div className='p-3'>
							<Tabs
								buttonProps={'btn-primary'}
								buttonGroupProps={'flex justify-center'}
								titles={['intro', 'assumptions']}
							>
								<div className='m-3 p-1 prose'>
									<p>
										Whenever you need to make predictions
										about complex situations you have little
										prior experience with, models and
										simulations are a good starting point to
										explore the situation and to make
										qualitative and quantitative predictions
										about how the situation may develop.
										This COVID-19 simulation presented here
										was developed by{' '}
										<a
											href='https://www.transentis.com'
											target='_blank'
										>
											transentis labs
										</a>{' '}
										based on the now very well known{' '}
										<a
											href='https://en.wikipedia.org/wiki/Compartmental_models_in_epidemiology'
											target='_blank'
										>
											SIR modell
										</a>
										. Please read the companion blog post{' '}
										<a
											href='https://www.transentis.com/covid-19-and-the-sir-model/en/'
											target='_blank'
										>
											Covid 19 and the SIR Model
										</a>{' '}
										for details on the model and a
										discussion of COVID-19 scenarios. The
										simulation was built entirely using the{' '}
										<a
											href='http://bptk.transentis.com'
											target='_blank'
										>
											BPTK framework
										</a>
										: BPTK-Py for the backend and the BPTK
										Widget Library for the dashboard itself.
										You can find the complete source code
										for both frontend and backend on{' '}
										<a
											href='https://github.com/transentis/sim-covid-19'
											target='_blank'
										>
											GitHub
										</a>
										.
									</p>
								</div>
								<div className='m-3'>
									<p>
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
									</p>
								</div>
							</Tabs>
						</div>
					}
					graphSettingsBox={
						<div className='relative m-2 p-3'>
							<div className='absolute right-2 top-2'>
								<Tooltip title={'Resets the dragchart'}>
									<IconButton
										style={{ color: '#009696' }}
										onClick={() =>
											console.error(
												'Implement new version',
											)
										}
										aria-label='reset'
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
										style={{ color: '#009696' }}
										onClick={() => {
											requestData()
										}}
										aria-label='run'
									>
										<PlayArrow />
									</IconButton>
								</Tooltip>
							</div>
							<p>Contact Rate</p>

							<div className='w-11/12'>
								<DragComponent
									data={defaultDragComponentState}
									colorTheme={DefaultGraphColors}
									onChangeData={(newData, tupleData) => {
										setRequestBody({
											...requestBody,
											settings: {
												smSir: {
													dashboard: {
														constants: {
															...requestBody
																.settings.smSir
																.dashboard
																.constants,
														},
														points: {
															contact_rate_table:
																tupleData,
														},
													},
												},
											},
										})
									}}
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
						</div>
					}
				></StandardGridLayout>
			</div>
		</div>
	)
}

export const getStaticProps = async () => {
	// Request Model Data for the Dashboard
	const requestedData = await bptkApi.requestModel(defaultModel())

	// If there was a problem retreiving the Data show a not found/error page
	if (!requestedData) {
		return {
			notFound: true,
		}
	}

	// Convert the data to be easily used in graphs => set them as props for the page
	const data = bptkApi.chartifyData(requestedData)

	return {
		props: {
			data: data,
		},
	}
}

export default Home

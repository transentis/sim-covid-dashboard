import React, { ReactNode, useEffect, useState } from 'react'
import Head from 'next/head'

import { Slider } from '@material-ui/core/'
import { NavigationButtons } from '../components'

import BPTKApi from '@transentis/bptk-connector'
import {
	ButtonGroup,
	Chart,
	DefaultGraphColors,
	Dropdown,
	DropdownItem,
	RadioButton,
	StandardGridLayout,
	Tabs,
} from '@transentis/bptk-widgets'
import { theme } from '../lib/constants/covid.dashboard.theme'

const bptkApi = new BPTKApi('MY API KEY')

const defaultModel = (scenario: string) => ({
	scenario_managers: ['smSir'],
	scenarios: [scenario],
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
})

interface Props {
	data: {
		contact_rate: [{ x: number; y: number }]
		reproduction_rate: [{ x: number; y: number }]
		total_population: [{ x: number; y: number }]
	}
	scenarios: Array<string>
}

const Scenarios = (props: Props) => {
	const { data, scenarios } = props

	const graphs = [['contact_rate'], ['recovered', 'deceased', 'infectious']]

	const [rangeSliderRange, setRangeSliderRange] = useState<number[]>([
		0,
		1499,
	])

	const [selectedGraph, setSelectedGraph] = useState<Array<string>>(graphs[0])
	const [graphData, setGraphData] = useState<any>(data)

	const [scenario, setScenario] = useState(scenarios[0])

	useEffect(() => {
		requestData()
	}, [scenario])

	const requestData = async () => {
		const requestedData = await bptkApi.requestModel(defaultModel(scenario))

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

	return (
		<div className='min-h-screen w-full bg-bg'>
			<Head>
				<title>COVID-19 Scenarios</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div className='overflow-hidden h-full'>
				<StandardGridLayout
					dashboardTitle={`COVID-19 Scenarios: ${scenario}`}
					graphTitle={selectedGraph[0]
						.toUpperCase()
						.replace('_', ' ')}
					graphComponent={
						<div className='p-2'>
							<Chart
								type={'AREA'}
								theme={theme}
								colorPalette={DefaultGraphColors}
								chartProps={{
									animate: {
										duration: 2000,
										onLoad: {
											duration: 1000,
										},
									},
									data: [
										...selectedGraph.map((graphName) =>
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
										...selectedGraph.map((graphName) => {
											return {
												name: graphName,
												color: 'green',
											}
										}),
									],
									x: 900,
									y: 250,
								}}
							></Chart>
						</div>
					}
					graphSettingComponent={
						<>
							<p>Visualization Range</p>
							<Slider
								value={rangeSliderRange}
								onChange={handleSliderChange}
								valueLabelDisplay='auto'
								min={0}
								max={1499}
							/>
						</>
					}
					graphTabsComponent={
						<div className='flex flex-row justify-center items-center'>
							<Dropdown color='accent' name='Scenarios'>
								{scenarios.map((scenario, index) => (
									<DropdownItem
										name={scenario}
										onClick={() => setScenario(scenario)}
										key={index}
									></DropdownItem>
								))}
							</Dropdown>
							<div className='p-4'>
								<ButtonGroup>
									<RadioButton
										onClick={() => handleGraphChange(0)}
										checked={true}
									>
										Contact Rate
									</RadioButton>
									<RadioButton
										onClick={() => handleGraphChange(1)}
									>
										Indicators
									</RadioButton>
								</ButtonGroup>
							</div>
						</div>
					}
					sidePanelComponent={
						<Tabs
							buttonProps={'btn-accent'}
							buttonGroupProps={'flex justify-center'}
							titles={['intro', 'assumptions']}
						>
							<div className='m-3'>
								<p>
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
								</p>
							</div>
							<div className='m-3'>
								<p>
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
								</p>
							</div>
						</Tabs>
					}
				></StandardGridLayout>
			</div>
			<NavigationButtons page={1}></NavigationButtons>
		</div>
	)
}

export const getStaticProps = async () => {
	const scenarios = await bptkApi.getScenarios()
	const requestedData = await bptkApi.requestModel(defaultModel(scenarios[0]))

	if (!requestedData) {
		return {
			notFound: true,
		}
	}

	const data = bptkApi.chartifyData(requestedData)

	return {
		props: {
			data: data,
			scenarios: scenarios,
		},
	}
}

export default Scenarios

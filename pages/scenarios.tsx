import React, { useEffect, useState } from 'react'
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
} from '@transentis/bptk-widgets'

import { theme } from '../lib/covid.dashboard.theme'
import { ScenarioMap } from '@transentis/bptk-connector/dist/types'

const bptkApi = new BPTKApi({
	backendUrl: 'https://api.transentis.com/bptk/transentis/covid-sim',
	apiKey: 'MY API KEY',
})

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
	scenarios: Array<ScenarioMap>
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
		const requestedData = await bptkApi.requestModel(
			defaultModel(scenario.name),
		)

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
					dashboardTitle={`COVID-19 Scenarios: ${scenario.displayName}`}
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
						<div className='flex flex-row justify-center items-center text-cyan-dark'>
							<Dropdown color='accent' name='Scenarios' hover>
								{scenarios.map((scenario, index) => (
									<DropdownItem
										name={scenario.displayName}
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
					titleSidePanelComponent={
						<div className='prose flex items-center text-center'>
							<h1>Description</h1>
						</div>
					}
					sidePanelComponent={
						<div className='prose'>
							<p>{scenario.description}</p>
						</div>
					}
				></StandardGridLayout>
			</div>
			<NavigationButtons page={1}></NavigationButtons>
		</div>
	)
}

export const getStaticProps = async () => {
	const dashboardConfig = await import('../lib/dashboard.config.json')

	const scenarios = await bptkApi.getScenarios()
	const mappedScenarios = bptkApi.scenarioEncoder(scenarios, dashboardConfig)
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
			scenarios: mappedScenarios,
		},
	}
}

export default Scenarios

import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'

import BPTKApi from '@transentis/bptk-connector'
import {
	ButtonGroup,
	Dropdown,
	DropdownItem,
	AreaChart,
	RadioButton,
	StandardGridLayout,
	ThemeSwitcher,
	ResponsiveDoubleRangeSlider as Slider,
} from '@transentis/bptk-widgets'

import { ScenarioMap } from '@transentis/bptk-connector/dist/types'
import { equations } from '../lib/equations.tabs.map'
import { defaultModel } from '../lib/btpk.models'

const bptkApi = new BPTKApi({
	backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
	apiKey: 'MY API KEY',
	trailingSlash: false,
})

const graphs = [
	equations.population,
	equations.intensiveCare,
	equations.indicators,
	equations.contact_rate,
]

interface Props {
	data: any
	scenarios: Array<ScenarioMap>
}

const Scenarios = (props: Props) => {
	const { data, scenarios } = props

	const isFirstRun = useRef(true)

	const [rangeSliderRange, setRangeSliderRange] = useState<number[]>([
		0, 1499,
	])

	const [selectedGraph, setSelectedGraph] = useState<{
		name: string
		equations: Array<string>
	}>(graphs[0])
	const [graphData, setGraphData] = useState<any>(data)

	const [scenario, setScenario] = useState(scenarios[0])

	useEffect(() => {
		if (isFirstRun.current) {
			isFirstRun.current = false
			return
		}
		requestData()
	}, [scenario])

	const requestData = async () => {
		const requestedData = await bptkApi.requestModel(
			defaultModel(scenario.manager, scenario.name),
		)

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
		<div className='min-h-screen w-full text-base-content'>
			<Head>
				<title>COVID-19 Scenarios</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div className='overflow-hidden h-full'>
				<StandardGridLayout
					dashboardTitle={`COVID-19 Scenarios: ${scenario.displayName}`}
					graphTitle={selectedGraph.name
						.toUpperCase()
						.replace('_', ' ')}
					graphComponent={
						<div style={{ width: '1200px', height: '400px' }}>
							<AreaChart
								curve={'cardinal'}
								enablePoints={false}
								enableGridX={false}
								enableGridY={false}
								enableSlices={'x'}
								xScale={{
									type: 'linear',
									min: 'auto',
									max: 'auto',
									reverse: false,
								}}
								data={bptkApi.reduceDataWithEquationsInRange(
									graphData,
									selectedGraph.equations,
									rangeSliderRange[0],
									rangeSliderRange[1],
								)}
							></AreaChart>
						</div>
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
					graphTabsComponent={
						<div className='flex flex-row justify-center items-center text-cyan-dark'>
							<Dropdown variant='primary' name='Scenarios' hover>
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
									{graphs.map((mapEquatios, index) => (
										<RadioButton
											onClick={() =>
												handleGraphChange(index)
											}
											checked={index === 0}
										>
											{mapEquatios.name}
										</RadioButton>
									))}
								</ButtonGroup>
							</div>
						</div>
					}
					titleSidePanelComponent={
						<div>
							<ThemeSwitcher
								themes={['transentisDark', 'transentisLight']}
							/>
						</div>
					}
					sidePanelComponent={
						<div className='prose'>
							<h1>{scenario.displayName}</h1>
							<p>{scenario.description}</p>
						</div>
					}
				></StandardGridLayout>
			</div>
		</div>
	)
}

export const getStaticProps = async () => {
	const dashboardConfig = await import('../lib/dashboard.config.json')

	const scenarios = await bptkApi.getScenarios()
	const mappedScenarios = bptkApi.scenarioEncoder(scenarios, dashboardConfig)

	const requestedData = await bptkApi.requestModel(
		defaultModel(mappedScenarios[0].manager, mappedScenarios[0].name),
	)

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

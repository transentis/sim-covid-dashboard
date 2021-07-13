import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'

import BPTKApi from '@transentis/bptk-connector'
import {
	Dropdown,
	DropdownItem,
	AreaChart,
	FullScreenGridLayout,
	ThemeToggle,
	ResponsiveDoubleRangeSlider as Slider,
	TabsButtonMenu,
	TabsButtonMenuItem,
} from '@transentis/bptk-widgets'

import { ScenarioMap } from '@transentis/bptk-connector/dist/types'
import { equations } from '../lib/equations.tabs.map'
import { defaultModel } from '../lib/btpk.models'
import { NavigationButtons } from '../components'
import { useRouter } from 'next/router'

const bptkApi = new BPTKApi({
	backendUrl:
		process.env.NEXT_PUBLIC_BACKEND_URL == undefined
			? 'http://localhost:5000'
			: process.env.NEXT_PUBLIC_BACKEND_URL,
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

	const router = useRouter()

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
		const model = defaultModel(scenario.manager, scenario.name)
		const requestedData = await bptkApi.requestModel(model)

		if (!requestedData) {
			return
		}

		setGraphData(
			bptkApi.chartifyData(
				requestedData[model.scenario_managers[0]][model.scenarios[0]]
					.equations,
			),
		)
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
			<div className='h-full w-full'>
				<FullScreenGridLayout
					dashboardTitle={`COVID-19 Scenarios: ${scenario.displayName}`}
					logoDivCSS='logoDiv'
					navigation={{
						pages: [
							{
								name: 'Dashboard',
								link: '/',
							},
							{
								name: 'Scenarios',
								link: '/scenarios',
							},
						],
						currentPage: 1,
						navigateFunction: (link: string) => {
							router.push(link)
						},
					}}
					themeComponent={
						<ThemeToggle
							lightTheme='transentisLight'
							darkTheme='transentisDark'
						/>
					}
					graphTitle={selectedGraph.name
						.toUpperCase()
						.replace('_', ' ')}
					graphComponent={
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
								<TabsButtonMenu
									className=''
									style='boxed'
									defaultSelectedIndex={0}
									onChange={(num) => handleGraphChange(num)}
								>
									{graphs.map((mapEquatios, index) => (
										<TabsButtonMenuItem
											name={mapEquatios.name.toLocaleUpperCase()}
										/>
									))}
								</TabsButtonMenu>
							</div>
						</div>
					}
					sidePanelComponent={
						<div className='prose'>
							<h1>{scenario.displayName}</h1>
							<p>{scenario.description}</p>
						</div>
					}
				></FullScreenGridLayout>
			</div>
		</div>
	)
}

export const getStaticProps = async () => {
	const dashboardConfig = await import('../lib/dashboard.config.json')

	const scenarios = await bptkApi.getScenarios()
	const mappedScenarios = bptkApi.scenarioEncoder(
		// @ts-ignore
		scenarios.smSir,
		dashboardConfig,
	)

	const model = defaultModel(
		mappedScenarios[0].manager,
		mappedScenarios[0].name,
	)
	const requestedData = await bptkApi.requestModel(model)

	if (!requestedData) {
		return {
			notFound: true,
		}
	}

	const data = bptkApi.chartifyData(
		requestedData[model.scenario_managers[0]][model.scenarios[0]].equations,
	)

	return {
		props: {
			data: data,
			scenarios: mappedScenarios,
		},
	}
}

export default Scenarios

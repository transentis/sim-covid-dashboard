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
import { Chart, DragChart, JsonInput, LoadingOverlay } from '../components'
import { VictoryTheme } from 'victory'
import { chartifyData, requestModel } from '../helpers/data.helpers'

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
		contact_rate: [{ x: number; y: number }]
		reproduction_rate: [{ x: number; y: number }]
	}
}

const Home = (props: Props) => {
	const { data } = props

	const [requestBody, setRequestBody] = useState('')

	const requestData = async () => {
		let requestedData
		if (requestBody !== '') {
			requestedData = await requestModel(requestBody)
		}

		if (!requestedData) {
			return
		}
	}

	const onNewJsonInput = (input) => {
		setRequestBody(input.jsObject)
	}

	const classes = useStyles()

	return (
		<>
			<Box className={classes.root}>
				<Head>
					<title>Covid Dashboard</title>
					<link rel='icon' href='/favicon.ico' />
				</Head>

				<main>
					<LoadingOverlay loading={false}></LoadingOverlay>
					<Box width='100%'>
						<Typography variant='h1' align='center'>
							Covid Dashboard
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
							<Paper style={{ margin: '2rem', padding: '2rem' }}>
								<Typography variant='h4' align='center'>
									Contact Rate
								</Typography>
								<Chart
									theme={VictoryTheme.material}
									lineProps={{
										animate: {
											duration: 2000,
											onLoad: { duration: 1000 },
										},
										data: data['contact_rate'],
									}}
									domain={[0, 40]}
									area
								></Chart>
							</Paper>
							<Paper style={{ margin: '2rem', padding: '2rem' }}>
								<Typography variant='h4' align='center'>
									Reproduction Rate
								</Typography>
								<Chart
									theme={VictoryTheme.material}
									lineProps={{
										animate: {
											duration: 2000,
											onLoad: { duration: 1000 },
										},
										data: data['reproduction_rate'],
									}}
									domain={[0, 40]}
									area
								></Chart>
							</Paper>
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
							<DragChart
								data={[10, 10, 15, 10, 10, 5, 0, 20, 10]}
								colorTheme={[
									'#ff8200',
									'#FF9055',
									'#FFA58C',
									'#FFBFBE',
								]}
								changeData={(newData) => console.log(newData)}
								width={400}
								height={400}
								margin={{
									top: 20,
									right: 20,
									bottom: -20,
									left: 20,
								}}
								maxValue={40}
							/>
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
		equations: ['contact_rate', 'reproduction_rate'],
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
	const requestedData = await requestModel(requestBody)

	if (!requestedData) {
		return {
			notFound: true,
		}
	}

	const data = await chartifyData(requestedData)

	return {
		props: {
			data: data,
		},
	}
}

export default Home

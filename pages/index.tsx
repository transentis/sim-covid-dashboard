import React from 'react'
import Head from 'next/head'

import { Box, makeStyles } from '@material-ui/core/'
import { LineChart } from '../components'
import { VictoryBrushContainer, VictoryTheme } from 'victory'

const useStyles = makeStyles((theme) => ({
    root: {},
}))

interface Props {
    data: {
        contact_rate: [{ x: number; y: number }]
        reproduction_rate: [{ x: number; y: number }]
    }
}

const Home = (props: Props) => {
    const { data } = props
    console.log(data.contact_rate)

    const classes = useStyles()
    return (
        <Box className={classes.root}>
            <Head>
                <title>BPTK Widgets</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <main>
                <LineChart
                    theme={VictoryTheme.material}
                    line={{
                        animate: {
                            duration: 2000,
                            onLoad: { duration: 1000 },
                        },
                        data: data.contact_rate,
                    }}
                    domain={[0, 40]}
                ></LineChart>
            </main>
        </Box>
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
    const res = await fetch(
        `http://sim-covid-api-dev.eu-central-1.elasticbeanstalk.com/run`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        },
    )
    const responseData = await res.json()
    const data = {}

    if (!responseData) {
        return {
            notFound: true,
        }
    } else {
        for (const attributes in responseData) {
            data[attributes] = Object.values(responseData[attributes]).map(
                (value: number, index: number) => {
                    return { x: index, y: value }
                },
            )
        }
    }

    return {
        props: {
            data: data,
        },
    }
}

export default Home

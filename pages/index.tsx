import React from 'react'
import Head from 'next/head'

import { Box, makeStyles } from '@material-ui/core/'
import { LineChart } from '../components'
import { VictoryBrushContainer, VictoryTheme } from 'victory'

const useStyles = makeStyles((theme) => ({
    root: {},
}))

interface Props {
    data: any
}

const Home = (props) => {
    console.log(props)
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
                    }}
                ></LineChart>
            </main>
        </Box>
    )
}

export const getStaticProps = async () => {
    const res = await fetch(
        `http://sim-covid-api-dev.eu-central-1.elasticbeanstalk.com/run`,
    )
    const data = await res.json()

    if (!data) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            data: data,
        },
    }
}

export default Home

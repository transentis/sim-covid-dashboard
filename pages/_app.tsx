import React from 'react'
import { AppProps } from 'next/dist/next-server/lib/router/router'

import { CssBaseline, ThemeProvider } from '@material-ui/core'
import { theme } from '../theme/theme'

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline></CssBaseline>
            <Component {...pageProps} />
        </ThemeProvider>
    )
}

export default MyApp

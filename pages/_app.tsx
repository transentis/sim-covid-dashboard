import React from 'react'
import { AppProps } from 'next/dist/next-server/lib/router/router'

import '../styles.css'
import MainLayout from '../layouts/MainLayout'

const MyApp = ({ Component, pageProps }: AppProps) => {
	return (
		<MainLayout>
			<Component {...pageProps} />
		</MainLayout>
	)
}

export default MyApp

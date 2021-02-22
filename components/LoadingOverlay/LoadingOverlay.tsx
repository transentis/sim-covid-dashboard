import React from 'react'
import { Backdrop, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
    },
}))

interface Props {
    loading: boolean
}

export default function LoadingOverlay(props: Props) {
    const classes = useStyles()

    return (
        <Backdrop className={classes.backdrop} open={props.loading}>
            <CircularProgress color='inherit' />
        </Backdrop>
    )
}

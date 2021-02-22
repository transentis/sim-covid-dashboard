import React, { ReactElement } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { Box } from '@material-ui/core'

import JSONInput from 'react-json-editor-ajrm'
import locale from 'react-json-editor-ajrm/locale/en'

const useStyles = makeStyles((theme) => ({
    root: {},
}))

interface Props {}

const JsonInput = (props: Props): ReactElement => {
    const classes = useStyles()
    return (
        <Box className={classes.root}>
            <JSONInput
                id='jsonInput'
                placeholder={{ putYourModelHere: {} }}
                locale={locale}
                height='550px'
                width='100%'
            />
        </Box>
    )
}

export default JsonInput

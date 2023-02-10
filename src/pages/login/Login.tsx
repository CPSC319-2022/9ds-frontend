import React, { FC } from 'react'
import Stack from '@mui/material/Stack'
import GetStartedTitle from './GetStartedTitle'
import LoginAndSignUpForm from './LoginAndSignUpForm'

const Login: FC = () => {
    return (
        <Stack
            direction='column'
            alignItems='stretch'
            spacing={64}
            boxSizing='border-box'
            p='24px'
        >
            <GetStartedTitle/>
            <LoginAndSignUpForm/>

        </Stack>
    )
}

export default Login
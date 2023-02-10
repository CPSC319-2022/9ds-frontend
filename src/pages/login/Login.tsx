import React, { FC } from 'react'
import Stack from '@mui/material/Stack'
import GetStarted from './GetStarted'
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
            <Stack>
                <GetStarted/>
            </Stack>
            <Stack>
                <LoginAndSignUpForm/>
            </Stack>

        </Stack>
    )
}

export default Login
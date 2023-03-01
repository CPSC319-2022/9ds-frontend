import React, { FC } from 'react'
import Stack from '@mui/material/Stack'
import GetStartedTitle from './GetStartedTitle'
import LoginAndSignUpForm from './LoginAndSignUpForm'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'

const Login: FC = () => {

    return (
        <Stack
            direction='column'
            alignItems='stretch'
            spacing={64}
            boxSizing='border-box'
            px='24px'
            py='27px'
        >
            <Header/>
            <GetStartedTitle/>
            <LoginAndSignUpForm/>
            <Footer/>
        </Stack>
    )
}

export default Login
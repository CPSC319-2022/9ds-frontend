import React, { FC } from 'react'
import Stack from '@mui/material/Stack'
import GetStartedTitle from './GetStartedTitle'
import LoginAndSignUpForm from './LoginAndSignUpForm'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { useEffect } from 'react';

const Login: FC = () => {

    function handleCallbackResponse (response) {
        // TODO send data to firebase?
        console.log("Successful login")
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            // TODO change this to 9ds project client id later
            client_id: "629482795908-34c0gkd0g9tn55pavf2obadbc1744sc3.apps.googleusercontent.com",
            callback: handleCallbackResponse
        });

        google.accounts.id.renderButton (
            document.getElementById("signInGoogle"),
            {theme: 'outlined', size: 'large', width: '178'}
        )

        google.accounts.id.renderButton (
            document.getElementById("signUpGoogle"),
            {theme: 'outlined', size: 'large', text: 'signup_with', width: '235'}
        )


    }, []);

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
import {Button, FormHelperText, IconButton, Stack, TextField, Typography} from '@mui/material'
import React, { useState, FormEvent } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSignInUserEmailPassword } from '../../hooks/firebase/useAuth'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [isEmailError, setIsEmailError] = useState(false)
    const [emailHelperText, setEmailHelperText] = useState('')

    const [password, setPassword] = useState('')
    const [isPasswordError, setIsPasswordError] = useState(false)
    const [passwordHelperText, setPasswordHelperText] = useState('')
    const [showPassword, setShowPassword] = React.useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const emailAccountSignIn = useSignInUserEmailPassword()

    function callBackSetWarningText() {
        console.log("callback starts now")
        console.log("error should load as " + emailAccountSignIn.error)
        console.log("user should load as " + emailAccountSignIn.user)
        if (emailAccountSignIn.user !== undefined) {
            console.log("you are logged in")
            console.log("going to dashboard...")
        } else if (emailAccountSignIn.error === undefined) {
            // remove this later once the user/error is loaded first
            console.log("user and error not loaded yet")
        } else if (emailAccountSignIn.error.toString() === "auth/wrong-password") {
            console.log("wrong pw")
            setIsPasswordError(true)
            setPasswordHelperText("Incorrect password.")
        } else if (emailAccountSignIn.error.toString() === "auth/user-not-found") {
            console.log("cannot find user")
            setIsEmailError(true)
            setEmailHelperText("Cannot find user with that username and password.")
        } else if (emailAccountSignIn.error.toString() === "auth/user-disabled") {
            console.log("user disabled")
            setIsEmailError(true)
            setEmailHelperText("User disabled.")
        } else {
            console.log("other error codes")
        }
    }

    const handleLogin = (e: FormEvent<HTMLElement>) => {
        let isInvalid = false
        if (email.length === 0 || !validateEmail(email)) {
            isInvalid = true
            setIsEmailError(true)
            if (email.length === 0) {
                setEmailHelperText("Email can't be empty.")
            } else {
                setEmailHelperText("Invalid email format.")
            }
        } else {
            setIsEmailError(false)
            setEmailHelperText('')
        }

        if (password.length === 0 || password.length < 6) {
            isInvalid = true
            setIsPasswordError(true)
            setPasswordHelperText("Invalid password.")
        } else {
            setIsPasswordError(false)
            setPasswordHelperText("")
        }

        if (!isInvalid) {
            emailAccountSignIn.signInWithEmailAndPasswordWrapper(email, password)
           // now I should have error and user detail, but the function is async, so the error and user isn't updated yet
            console.log("error is " + emailAccountSignIn.error)
            console.log("user is " + emailAccountSignIn.user)
            if (emailAccountSignIn.user !== undefined) {
                console.log("you are logged in")
                console.log("going to dashboard...")
            } else if (emailAccountSignIn.error === undefined) {
                // remove this later once the user/error is loaded first
                console.log("user and error not loaded yet")
            } else if (emailAccountSignIn.error.toString() === "auth/wrong-password") {
                console.log("wrong pw")
                setIsPasswordError(true)
                setPasswordHelperText("Incorrect password.")
            } else if (emailAccountSignIn.error.toString() === "auth/user-not-found") {
                console.log("cannot find user")
                setIsEmailError(true)
                setEmailHelperText("Cannot find user with that username and password.")
            } else if (emailAccountSignIn.error.toString() === "auth/user-disabled"){
                console.log("user disabled")
                setIsEmailError(true)
                setEmailHelperText("User disabled.")
            } else {
                console.log("other error codes")
            }
        }
        e.preventDefault()
    }

    return (
        <form
            onSubmit={(event) => {
                handleLogin(event)
            }}
        >
        <Stack
            width='390px'
            direction='column'
            justifyContent='flex-start'
            alignItems='stretch'
            borderRadius='12px'
            sx={{backgroundColor: 'white.light'}}
            p='32px'
            spacing={24}
        >
            <Button
                variant='outlined'
                sx={{boxShadow:2, alignSelf:'flex-start'}}
            >
                <Typography variant='button'>LOGIN WITH EMAIL</Typography>
            </Button>
            <TextField
                id="signInEmail"
                label='Email'
                variant='outlined'
                onChange={(event) => {
                    setEmail(event.target.value)
                }}
                error={isEmailError}
                helperText={emailHelperText}
            />
            <FormControl variant='outlined'>
                <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
                <OutlinedInput
                    id='login-outlined-adornment-password'
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position='end'>
                            <IconButton
                                aria-label='toggle password visibility'
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge='end'
                            >
                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                            </IconButton>
                        </InputAdornment>
                    }
                    label='Password'
                    onChange={(event) => {
                        setPassword(event.target.value)
                    }}
                    error={!!isPasswordError}
                />
                {!!isPasswordError && (
                    <FormHelperText error id="passWord-error">
                        {passwordHelperText}
                    </FormHelperText>
                )}
            </FormControl>
            <Stack
                direction='row'
                alignItems='flex-end'
                justifyContent='flex-end'
            >
                <Button
                    type='submit'
                    variant='contained'
                    sx={{alignSelf:'flex-start', backgroundColor: 'black.main'}}
                >
                    <Typography variant='button'>LOGIN</Typography>
                </Button>
            </Stack>
        </Stack>
        </form>

    )
}

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export default LoginForm

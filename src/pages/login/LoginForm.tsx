import {Button, FormHelperText, IconButton, Stack, TextField, Typography, Link} from '@mui/material'
import React, { useState, FormEvent } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSignInUserEmailPassword } from '../../hooks/firebase/useAuth'

const LoginForm = () => {
    const navigate = useNavigate();

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
            // need error to be updated
            if (emailAccountSignIn.error === undefined) {
                // first try login success
                if (emailAccountSignIn.user !== undefined){
                    console.log(emailAccountSignIn.user)
                    console.log("loginSuccess")
                    // if successful, navigate to dashboard
                    navigate("/")
                }
            } else if (emailAccountSignIn.error.toString() === "auth/wrong-password" && emailAccountSignIn.user === undefined) {
                setIsPasswordError(true)
                setPasswordHelperText("Incorrect password.")
            } else if (emailAccountSignIn.error.toString() === "auth/user-not-found" && emailAccountSignIn.user === undefined) {
                setIsEmailError(true)
                setEmailHelperText("Cannot find user with that username and password.")
            } else if (emailAccountSignIn.error.toString() === "auth/user-disabled" && emailAccountSignIn.user === undefined) {
                setIsEmailError(true)
                setEmailHelperText("User corresponding to the given email has been disabled.")
            } else if (emailAccountSignIn.user !== undefined) {
                // 2nd or more tries logging in success
                console.log(emailAccountSignIn.user)
                console.log("loginSuccess")
                navigate("/")
            } else {
                console.log("other errors not covered")
            }

            // auth/user-disabled
            // Thrown if the user corresponding to the given email has been disabled.
            // auth/user-not-found
            // Thrown if there is no user corresponding to the given email.
            // auth/wrong-password
            // Thrown if the password is invalid for the given email,
            // or the account corresponding to the email does not have a password set.
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
                justifyContent='space-between'
            >
                <Link component={RouterLink} to="/" underline='none' color='#2602FF'>
                    <Typography variant='small'>Forgot password?</Typography>
                </Link>
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

const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export default LoginForm

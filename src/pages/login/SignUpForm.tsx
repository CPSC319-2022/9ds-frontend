import React, { useState, FormEvent } from 'react'
import {
    Stack,
    TextField,
    Button,
    Typography,
    IconButton,
    FormHelperText,
} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import googleIcon from '../../assets/googleIcon.png';
import {useCreateUserEmailPassword, useSignInWithGoogle} from '../../hooks/firebase/useAuth'

const SignUpForm = () => {
    const [email, setEmail] = useState('')
    const [isEmailError, setIsEmailError] = useState(false)
    const [emailHelperText, setEmailHelperText] = useState('')

    const [password, setPassword] = useState('')
    const [isPasswordError, setIsPasswordError] = useState(false)
    const [passwordHelperText, setPasswordHelperText] = useState('')

    const [name, setName] = useState('')
    const [isNameError, setIsNameError] = useState(false)
    const [nameHelperText, setnameHelperText] = useState('')

    const [profImageLink, setProfImage] = useState('')
    // const [isProfImageLinkError, setIsProfImageLinkError] = useState(false)
    // const [profImageLinkHelperText, setProfImageLinkHelperText] = useState('')

    const [showPassword, setShowPassword] = React.useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const emailAccountCreate = useCreateUserEmailPassword()
    const signInWithGoogle = useSignInWithGoogle()



    const handleSignUp = (e:  FormEvent<HTMLElement>) => {
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
        if (name.length === 0) {
            isInvalid = true
            setIsNameError(true)
            setnameHelperText("Name can't be empty.")
        } else {
            setIsNameError(false)
            setnameHelperText("")
        }
        if (password.length === 0 || password.length < 6) {
            isInvalid = true
            setIsPasswordError(true)
            setPasswordHelperText("Password can't be empty and should be at least 6 character.")
        } else {
            setIsPasswordError(false)
            setPasswordHelperText("")
        }

        if (!isInvalid) {
            emailAccountCreate.createWithEmailAndPasswordWrapper(
                email,
                password,
                name,
                profImageLink
            )
            if (emailAccountCreate.user !== undefined) {
                // if successful, navigate to dashboard
                // not happening, because user is always undefined, not sure how to know user is created
                console.log("SignUp success")
                console.log("going to dashboard...")
            } else if (emailAccountCreate.error === undefined) {
                // remove this later once the user/error is loaded first
                console.log("user and error not loaded yet")
            } else if (emailAccountCreate.error.toString() === "auth/email-already-in-use") {
                setIsEmailError(true)
                setEmailHelperText("There already exists an account with the given email address.")
            } else if (emailAccountCreate.error.toString() === "operation-not-allowed") {
                setIsEmailError(true)
                setEmailHelperText("This email/password account is not enabled")
            } else {
                console.log("other error codes")
            }

            // auth/email-already-in-use
            // Thrown if there already exists an account with the given email address.
            // auth/invalid-email
            // Thrown if the email address is not valid.
            // auth/operation-not-allowed
            // Thrown if email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.

        }
        e.preventDefault()
    }

    return (
        <form
            onSubmit={(event) => {
                handleSignUp(event)
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
                    sx={{padding:'6px 22px 6px 16px', boxShadow: 2, alignSelf:'flex-start'}} variant='outlined'
                    onClick ={() => {
                        signInWithGoogle.signInWithGoogleWrapper()
                    }}
                >
                    <Stack direction='row' alignItems='center' justifyContent='space-around'  spacing={8}>
                        <img src={googleIcon} width='24px' height='25px' />
                        <Typography variant='button'>SIGNUP WITH GOOGLE</Typography>
                    </Stack>
                </Button>
                <Stack direction='row' alignItems='center' justifyContent='space-around' spacing={24}>
                    <Typography variant='body1.medium' sx={{fontSize:'14px', weight:600}}>Or</Typography>
                </Stack>
                <TextField
                    id='name'
                    label='Name'
                    variant='outlined'
                    onChange={(event) => {
                        setName(event.target.value)
                    }}
                    error={isNameError}
                    helperText={nameHelperText}
                />
                <TextField
                    id='email'
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
                        id='outlined-adornment-password'
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

                <TextField
                    id='profImgLink'
                    label='Profile image link'
                    variant='outlined'
                    onChange={(event) => {
                        setProfImage(event.target.value)
                    }}
                    // error={isProfImageLinkError}
                    // helperText={profImageLinkHelperText}
                />
                <Button
                    variant='contained' sx={{
                    alignSelf:'flex-start',
                    backgroundColor: 'black.main', }}
                    onClick={(event) => handleSignUp(event)}
                >
                    <Typography variant='button'>
                        SIGN UP
                    </Typography>
                </Button>
            </Stack>
        </form>
    )
}

export default SignUpForm

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

import React, { useState, FormEvent, useEffect } from 'react'
import {
    Stack,
    TextField,
    Button,
    Typography,
    IconButton,
    FormHelperText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import googleIcon from '../../assets/googleIcon.png';
import {useCreateUserEmailPassword, useSignInWithGoogle} from '../../hooks/firebase/useAuth'


export const SignUpForm = () => {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [isEmailError, setIsEmailError] = useState(false)
    const [emailHelperText, setEmailHelperText] = useState('')

    const [password, setPassword] = useState('')
    const [isPasswordError, setIsPasswordError] = useState(false)
    const [passwordHelperText, setPasswordHelperText] = useState('')

    const [name, setName] = useState('')
    const [isNameError, setIsNameError] = useState(false)
    const [nameHelperText, setnameHelperText] = useState('')

    const [profImageLink, setProfImageLink] = useState('https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg')

    const [showPassword, setShowPassword] = React.useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const emailAccountCreate = useCreateUserEmailPassword()
    const signInWithGoogle = useSignInWithGoogle()

    useEffect(() => {
        if (emailAccountCreate.user) {
            console.log(emailAccountCreate.user)
            navigate("/")
        }
    }, [emailAccountCreate.user])

    useEffect(() => {
        if (signInWithGoogle.user) {
            console.log(signInWithGoogle.user)
            navigate("/")
        }
    }, [signInWithGoogle.user])

    // signUp Error
    // https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#createuserwithemailandpassword
    useEffect(() => {
        const error =  emailAccountCreate.error?.toString() ?? ""
        switch (error) {
            case "auth/email-already-in-use":
                setIsEmailError(true)
                setEmailHelperText("There already exists an account with the given email address.")
                setIsPasswordError(false)
                setPasswordHelperText("")
                break;
            case "operation-not-allowed":
                setIsEmailError(true)
                setEmailHelperText("This email/password account is not enabled.")
                setIsPasswordError(false)
                setPasswordHelperText("")
                break;
            case "auth/invalid-email":
                setIsEmailError(true)
                setEmailHelperText("This email address is not valid.")
                setIsPasswordError(false)
                setPasswordHelperText("")
                break;
            default:
                setIsEmailError(false)
                setEmailHelperText("")
                setIsPasswordError(false)
                setPasswordHelperText("")
                break;
        }
    }, [emailAccountCreate.error])


    const handleSignUp = (e:  FormEvent<HTMLElement>) => {
        let isInvalid = false
        if (!email.length) {
            isInvalid = true
            setIsEmailError(true)
            if (!email.length) {
                setEmailHelperText("Email can't be empty.")
            } else {
                setEmailHelperText("Invalid email format.")
            }
        } else {
            setIsEmailError(false)
            setEmailHelperText('')
        }
        if (!name.length) {
            isInvalid = true
            setIsNameError(true)
            setnameHelperText("Name can't be empty.")
        } else {
            setIsNameError(false)
            setnameHelperText("")
        }
        if (!password.length || password.length < 6) {
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

        }
        e.preventDefault()
    }

    return (
        <form
            onSubmit={(event) => handleSignUp(event)}
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
                    onClick ={() => signInWithGoogle.signInWithGoogleWrapper()}
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
                    onChange={(event) => setName(event.target.value)}
                    error={isNameError}
                    helperText={nameHelperText}
                />
                <TextField
                    id='email'
                    label='Email'
                    variant='outlined'
                    onChange={(event) =>  setEmail(event.target.value)}
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
                        onChange={(event) => setPassword(event.target.value)}
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
                        if (!isProfImgLinkValid(event.target.value)){
                            setProfImageLink("https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg")
                        } else {
                            setProfImageLink(event.target.value)
                        }
                    }}
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


const IMAGE_LINK_REGEX = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/

export const isProfImgLinkValid = (link: string) => IMAGE_LINK_REGEX.test(link)
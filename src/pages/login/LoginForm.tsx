import {
  Button,
  FormHelperText,
  IconButton,
  Stack,
  TextField,
  Typography,
  Link,
} from '@mui/material'
import React, { useState, FormEvent, useEffect, useContext } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
  useSignInUserEmailPassword,
  useSignInWithGoogle,
} from '../../hooks/firebase/useAuth'
import googleIcon from '../../assets/googleIcon.png'
import { NotificationContext } from '../../context/NotificationContext'

export const LoginForm = () => {
  const navigate = useNavigate()
  const { dispatch } = useContext(NotificationContext)

  const [email, setEmail] = useState('')
  const [isEmailError, setIsEmailError] = useState(false)
  const [emailHelperText, setEmailHelperText] = useState('')

  const [password, setPassword] = useState('')
  const [isPasswordError, setIsPasswordError] = useState(false)
  const [passwordHelperText, setPasswordHelperText] = useState('')
  const [showPassword, setShowPassword] = React.useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  const emailAccountSignIn = useSignInUserEmailPassword()
  const signInWithGoogle = useSignInWithGoogle()

  useEffect(() => {
    if (signInWithGoogle.user) {
      navigate('/')
    }
  }, [signInWithGoogle.user])

  // signIn success
  useEffect(() => {
    if (emailAccountSignIn.user) {
      navigate('/')
    }
  }, [emailAccountSignIn.user])

  // signIn error
  // https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithemailandpassword
  useEffect(() => {
    const error = emailAccountSignIn.error?.toString() ?? ''
    switch (error) {
      case 'auth/wrong-password':
        setIsEmailError(false)
        setEmailHelperText('')
        setIsPasswordError(true)
        setPasswordHelperText('Incorrect password.')
        break
      case 'auth/user-not-found':
        setIsEmailError(true)
        setEmailHelperText('Cannot find user with that username and password.')
        setIsPasswordError(false)
        setPasswordHelperText('')
        break
      case 'auth/user-disabled':
        setIsEmailError(true)
        setEmailHelperText(
          'User corresponding to the given email has been disabled.',
        )
        setIsPasswordError(false)
        setPasswordHelperText('')
        break
      case 'auth/invalid-email':
        setIsEmailError(true)
        setEmailHelperText('The email address is not valid.')
        setIsPasswordError(false)
        setPasswordHelperText('')
        break
      case 'permission-denied':
        setIsEmailError(true)
        setEmailHelperText('')
        setIsPasswordError(true)
        setPasswordHelperText('')
        dispatch({
          notificationActionType: 'error',
          message: 'This user has been banned',
        })
        break
      default:
        setIsEmailError(false)
        setEmailHelperText('')
        setIsPasswordError(false)
        setPasswordHelperText('')
        break
    }
  }, [emailAccountSignIn.error])

  const handleLogin = (e: FormEvent<HTMLElement>) => {
    let isInvalid = false
    if (!email.length) {
      isInvalid = true
      setIsEmailError(true)
      setEmailHelperText("Email can't be empty.")
    } else {
      setIsEmailError(false)
      setEmailHelperText('')
    }

    if (!password.length) {
      isInvalid = true
      setIsPasswordError(true)
      setPasswordHelperText("Password can't be empty.")
    } else {
      setIsPasswordError(false)
      setPasswordHelperText('')
    }
    if (!isInvalid) {
      emailAccountSignIn.signInWithEmailAndPasswordWrapper(email, password)
    }
    e.preventDefault()
  }

  return (
    <form onSubmit={(event) => handleLogin(event)} data-testid='login-up-form'>
      <Stack
        width='390px'
        direction='column'
        justifyContent='flex-start'
        alignItems='stretch'
        borderRadius='12px'
        sx={{ backgroundColor: 'white.light' }}
        p='32px'
        spacing={24}
      >
        <Button
          sx={{
            padding: '6px 22px 6px 16px',
            boxShadow: 2,
            alignSelf: 'flex-start',
          }}
          variant='outlined'
          onClick={() => signInWithGoogle.signInWithGoogleWrapper()}
        >
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-around'
            spacing={8}
          >
            <img src={googleIcon} width='24px' height='25px' />
            <Typography variant='button'>Sign In With Google</Typography>
          </Stack>
        </Button>
        <TextField
          id='signInEmail'
          label='Email'
          variant='outlined'
          onChange={(event) => setEmail(event.target.value)}
          error={isEmailError}
          helperText={emailHelperText}
        />
        <FormControl variant='outlined'>
          <InputLabel htmlFor='outlined-adornment-password'>
            Password
          </InputLabel>
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
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label='Password'
            onChange={(event) => setPassword(event.target.value)}
            error={!!isPasswordError}
          />
          {!!isPasswordError && (
            <FormHelperText error id='passWord-error'>
              {passwordHelperText}
            </FormHelperText>
          )}
        </FormControl>
        <Stack
          direction='row'
          alignItems='flex-end'
          justifyContent='space-between'
        >
          <Link
            component={RouterLink}
            to='/reset/email'
            underline='none'
            color='#2602FF'
          >
            <Typography variant='small'>Forgot password?</Typography>
          </Link>
          <Button
            type='submit'
            variant='contained'
            sx={{ alignSelf: 'flex-start', backgroundColor: 'black.main' }}
          >
            <Typography variant='button'>LOGIN</Typography>
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}

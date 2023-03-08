import { TextField, Typography, Box, FormHelperText } from '@mui/material'
import { Stack } from '@mui/system'
import { FC, FormEvent, useState } from 'react'
import { Button } from '../Button'
import { useForgotPasswordEmail } from '../../hooks/firebase/useAuth'
import { useNavigate } from 'react-router-dom'

enum ForgotPasswordErrors {
    invalidEmail = "auth/invalid-email",
    userNotFound = "auth/user-not-found"
}


export const EmailVerificationForm: FC = () => {
    const [emailError, setEmailError] = useState('')
    const [email, setEmail] = useState('')
    
    const navigate = useNavigate();
    const forgotPasswordHandler = useForgotPasswordEmail()
    
    const sendEmailLink = (event: FormEvent<HTMLElement>) => {
        event.preventDefault()
    
        forgotPasswordHandler.sendEmail(email.trim())
        const error = forgotPasswordHandler.error?.code ?? "success"
    
        switch(error) {
            case "success":
                navigate("/login")
                break
            case ForgotPasswordErrors.invalidEmail:
                setEmailError("Invalid email")
                break
            case ForgotPasswordErrors.userNotFound:
                setEmailError("User was not found")
                break
            default:
                setEmailError("Unable to send email link")
                break
        }
    }
  return (
    <form onSubmit={sendEmailLink}>
      <Typography variant='h3'>Reset Password</Typography>
      <Stack
        width='270px'
        direction='column'
        justifyContent='flex-start'
        alignItems='stretch'
        borderRadius='12px'
        sx={{ backgroundColor: 'white.light' }}
        p='32px'
        spacing={24}
      >
        <Box component='div'>
          <TextField
            id='email'
            label='Email'
            variant='outlined'
            error={emailError.length > 0}
            onChange={(event) => {setEmail(event.target.value)}}
            sx={{ width: '100%' }}
          />
          {emailError.length > 0 && (
            <FormHelperText error={true} sx={{ pl: '13px' }}>
              {emailError}
            </FormHelperText>
          )}
        </Box>
        <Button
          dark={true}
          text='SEND RESET PASSWORD LINK'
          type={"submit"}
          style={{ color: 'white.main'}}
        />
      </Stack>
    </form>
  )
}

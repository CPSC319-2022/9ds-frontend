import { Divider, Stack } from '@mui/material'
import { SignUpForm } from './SignUpForm'
import { LoginForm } from './LoginForm'

export const LoginAndSignUpForm = () => {
  return (
    <Stack
      direction='row'
      spacing={62}
      px='25px'
      alignItems='center'
      justifyContent='center'
      data-testid='login-signup-stack'
    >
      <SignUpForm />
      <Divider
        data-testid='login-signup-divider'
        orientation='vertical'
        sx={{ borderColor: 'black.main', height: '300px' }}
      ></Divider>
      <LoginForm />
    </Stack>
  )
}

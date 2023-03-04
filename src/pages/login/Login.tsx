import React, { FC } from 'react'
import GetStartedTitle from './GetStartedTitle'
import LoginAndSignUpForm from './LoginAndSignUpForm'
import { AppWrapper } from '../../components'

const Login: FC = () => {
  return (
    <AppWrapper>
      <GetStartedTitle />
      <LoginAndSignUpForm />
    </AppWrapper>
  )
}

export default Login

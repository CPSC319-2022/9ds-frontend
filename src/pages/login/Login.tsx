import React, { FC, useEffect } from 'react'
import { GetStartedTitle } from './GetStartedTitle'
import { LoginAndSignUpForm } from './LoginAndSignUpForm'
import { AppWrapper } from '../../components/AppWrapper'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/firebase/useUser'
import { useAuth } from 'hooks/firebase/useAuth'

export const Login: FC = () => {
  return (
    <AppWrapper>
      <GetStartedTitle />
      <LoginAndSignUpForm />
    </AppWrapper>
  )
}

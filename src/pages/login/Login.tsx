import React, { FC, useEffect } from 'react'
import { GetStartedTitle } from './GetStartedTitle'
import { LoginAndSignUpForm } from './LoginAndSignUpForm'
import { AppWrapper } from '../../components/AppWrapper'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/firebase/useUser'
import { useAuth } from 'hooks/firebase/useAuth'

export const Login: FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user])

  return (
    <AppWrapper>
      <GetStartedTitle />
      <LoginAndSignUpForm />
    </AppWrapper>
  )
}

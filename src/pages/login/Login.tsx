import React, { FC, useEffect } from 'react'
import { GetStartedTitle } from './GetStartedTitle'
import { LoginAndSignUpForm } from './LoginAndSignUpForm'
import { AppWrapper } from '../../components/AppWrapper'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/firebase/useUser'

export const Login: FC = () => {
  const navigate = useNavigate()
  const { queriedUser, loading } = useUser()

  useEffect(() => {
    if (!loading && queriedUser.uid) {
      navigate('/')
    }
  }, [queriedUser, loading])

  return (
    <AppWrapper>
      <GetStartedTitle />
      <LoginAndSignUpForm />
    </AppWrapper>
  )
}

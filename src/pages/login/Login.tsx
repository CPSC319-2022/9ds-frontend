import { FC, useContext, useEffect } from 'react'
import { GetStartedTitle } from './GetStartedTitle'
import { LoginAndSignUpForm } from './LoginAndSignUpForm'
import { AppWrapper } from '../../components/AppWrapper'
import { useNavigate } from 'react-router-dom'
import { UserContext } from 'context/UserContext'

export const Login: FC = () => {
  const { state } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (state.queriedUser.uid) {
      navigate('/')
    }
  }, [state])

  return (
    <AppWrapper>
      <GetStartedTitle />
      <LoginAndSignUpForm />
    </AppWrapper>
  )
}

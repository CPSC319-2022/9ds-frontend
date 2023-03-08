import { ConfirmPasswordForm } from '../../components/ConfirmPasswordForm'
import { FC } from 'react'
import { AppWrapper } from '../../components/AppWrapper'

export const ConfirmPassword: FC = () => {
  return (
    <AppWrapper spacing={100}>
       <ConfirmPasswordForm />
    </AppWrapper>
  )
}
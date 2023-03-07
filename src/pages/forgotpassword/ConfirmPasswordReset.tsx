import { ConfirmPasswordForm } from '../../components/ResetPassword'
import { FC } from 'react'
import { AppWrapper } from '../../components'

export const ConfirmPassword: FC = () => {
  return (
    <AppWrapper spacing={100}>
       <ConfirmPasswordForm />
    </AppWrapper>
  )
}
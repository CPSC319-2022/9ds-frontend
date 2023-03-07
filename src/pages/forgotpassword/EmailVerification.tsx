import { EmailVerificationForm } from '../../components/ResetPassword'
import { FC } from 'react'
import { AppWrapper } from '../../components'

export const EmailVerification: FC = () => {
  return (
    <AppWrapper spacing={100}>
       <EmailVerificationForm />
    </AppWrapper>
  )
}

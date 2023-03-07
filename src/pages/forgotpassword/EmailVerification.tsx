import { EmailVerificationForm } from '../../components/EmailVerificationForm'
import { FC } from 'react'
import { AppWrapper } from '../../components/AppWrapper'

export const EmailVerification: FC = () => {
  return (
    <AppWrapper spacing={100}>
       <EmailVerificationForm />
    </AppWrapper>
  )
}

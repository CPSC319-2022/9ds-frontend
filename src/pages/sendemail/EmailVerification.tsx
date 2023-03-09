import { EmailVerificationForm } from '../../components/EmailVerificationForm'
import { FC } from 'react'
import { AppWrapper } from '../../components/AppWrapper'
import Typography from '@mui/material/Typography'

export const EmailVerification: FC = () => {
  return (
    <AppWrapper spacing={100}>
        <Typography variant='h3'>Reset Password</Typography>
       <EmailVerificationForm />
    </AppWrapper>
  )
}

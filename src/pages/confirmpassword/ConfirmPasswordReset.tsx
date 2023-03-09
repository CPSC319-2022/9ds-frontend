import { ConfirmPasswordForm } from '../../components/ConfirmPasswordForm'
import { FC } from 'react'
import { AppWrapper } from '../../components/AppWrapper'
import Typography from '@mui/material/Typography'

export const ConfirmPassword: FC = () => {
  return (
    <AppWrapper spacing={100}>
        <Typography variant='h3'>New password</Typography>
       <ConfirmPasswordForm />
    </AppWrapper>
  )
}
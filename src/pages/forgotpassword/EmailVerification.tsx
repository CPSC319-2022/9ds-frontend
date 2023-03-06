import {TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { FC } from 'react'
import { AppWrapper, Button } from '../../components'

export const VerifyEmail: FC = () => {
  return (
    <AppWrapper spacing={100}>
        <Typography variant="h3">
            Reset Password
        </Typography>
        <Stack
            width='270px'
            direction='column'
            justifyContent='flex-start'
            alignItems='stretch'
            borderRadius='12px'
            sx={{backgroundColor: 'white.light'}}
            p='32px'
            spacing={24}
    >
    <TextField id='email' label='Email' variant="outlined" />
    <Button dark={true} text='SEND RESET PASSWORD LINK' style={{ color: 'white.main'}}/>
    </Stack>
    </AppWrapper>
  )
}

import { TextField, Typography, Box, FormHelperText } from '@mui/material'
import { Stack } from '@mui/system'
import { FC, useState } from 'react'
import { Button } from '../Button'
/*@typescript-eslint/no-unused-vars*/

export const EmailVerificationForm: FC = () => {
  const [emailError, setEmailError] = useState('')
  const [email, setEmail] = useState('')

  return (
    <>
      <Typography variant='h3'>Reset Password</Typography>
      <Stack
        width='270px'
        direction='column'
        justifyContent='flex-start'
        alignItems='stretch'
        borderRadius='12px'
        sx={{ backgroundColor: 'white.light' }}
        p='32px'
        spacing={24}
      >
        <Box component='div'>
          <TextField
            id='email'
            label='Email'
            variant='outlined'
            error={emailError.length > 0}
            sx={{ width: '100%' }}
          />
          {emailError.length > 0 && (
            <FormHelperText error={true} sx={{ pl: '13px' }}>
              {emailError}
            </FormHelperText>
          )}
        </Box>
        <Button
          dark={true}
          text='SEND RESET PASSWORD LINK'
          style={{ color: 'white.main' }}
        />
      </Stack>
    </>
  )
}

import { Typography } from '@mui/material'
import { PasswordField } from '../PasswordField/PasswordField'
import { Stack } from '@mui/system'
import { FC, useState } from 'react'
import { Button } from '../Button'
/* eslint-disable @typescript-eslint/no-unused-vars */

export const ConfirmPasswordForm: FC = () => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [codeError, setCodeError] = useState('')

  return (
    <>
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
        <PasswordField
          label='New password'
          setPassword={setNewPassword}
          error={passwordError}
        />
        <PasswordField
          label='Confirm password'
          setPassword={setConfirmPassword}
          error={passwordError}
        />
        <Button
          variant='contained'
          dark={true}
          text='CONFIRM'
          style={{ alignSelf: 'flex-start', color: 'white.main' }}
        />
      </Stack>
    </>
  )
}

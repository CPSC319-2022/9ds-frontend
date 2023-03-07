import { TextField, Typography, FormHelperText, Box } from '@mui/material'
import { PasswordField } from '../PasswordField/PasswordField'
import { Stack } from '@mui/system'
import { FC, useState } from 'react'
import { Button } from '../../components'
/*@typescript-eslint/no-unused-vars*/

export const ConfirmPasswordForm: FC = () => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [codeError, setCodeError] = useState('')

  return (
    <>
      <Typography variant='h3'>New password</Typography>
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
            id='code'
            label='Code'
            variant='outlined'
            error={codeError.length > 0}
            sx={{ width: '100%' }}
          />
          {codeError.length > 0 && (
            <FormHelperText error={true} sx={{ pl: '13px' }}>
              {codeError}
            </FormHelperText>
          )}
        </Box>
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

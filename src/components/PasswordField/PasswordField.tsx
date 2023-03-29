import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material'
import { VisibilityOff, Visibility } from '@mui/icons-material'
import { FC, useState } from 'react'

/* @typescript-eslint/no-unused-vars */
export interface PasswordProps {
  label: string
  setPassword: Function
  error: string
}

export const PasswordField: FC<PasswordProps> = ({
  label,
  setPassword,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(true)
  const handleClickShowPassword = () =>
    setShowPassword((show: boolean) => !show)

  const handleMouseEventPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  return (
    <FormControl variant='outlined'>
      <InputLabel htmlFor={label} error={error.length > 0}>
        {label}
      </InputLabel>
      <OutlinedInput
        data-testid='password-input'
        id={label}
        type={showPassword ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseEventPassword}
              onMouseUp={handleMouseEventPassword}
              edge='end'
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        onChange={(event) => setPassword(event.target.value)}
        label={label}
        error={error.length > 0}
      />
      {error.length > 0 && (
        <FormHelperText error={true}>{error}</FormHelperText>
      )}
    </FormControl>
  )
}

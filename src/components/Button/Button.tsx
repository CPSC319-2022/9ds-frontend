import Typography from '@mui/material/Typography'
import React, { FC, MouseEventHandler, ReactNode } from 'react'
import MuiButton from '@mui/material/Button'

type ButtonProps = {
  dark?: boolean
  text: string
  variant?: 'contained' | 'outlined'
  size?: 'large' | 'medium'
  style?: { [k: string]: unknown }
  href?: string
  startIcon?: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined
  darkText?: boolean
  type?: undefined | 'submit'
}

export const Button: FC<ButtonProps> = ({
  dark,
  text,
  variant,
  size,
  style,
  href,
  startIcon,
  onClick,
  type,
}) => {
  const textColor = dark && variant === 'outlined' ? 'black.main' : 'white.main'
  const bgColor = dark && variant === 'outlined' ? undefined : 'black.main'
  const borderColor = dark ? 'black' : 'white'

  return (
    <MuiButton
      variant={variant ?? 'contained'}
      size={size ?? 'medium'}
      type={type}
      startIcon={startIcon}
      onClick={onClick}
      href={href}
      sx={{
        backgroundColor: bgColor,
        border: `2px solid ${borderColor}`,
        ...style,
      }}
    >
      <Typography
        variant='button'
        noWrap
        sx={{
          color: textColor,
          textTransform: 'none',
        }}
      >
        {text}
      </Typography>
    </MuiButton>
  )
}

import Typography from '@mui/material/Typography'
import React from 'react'
import MuiButton from '@mui/material/Button'

type ButtonProps = {
  dark?: boolean
  text: string
  variant?: 'contained' | 'outlined'
  size?: 'large' | 'medium'
  style?: { [k: string]: any }
  href?: string
  startIcon?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined
}

const Button = ({
  dark,
  text,
  variant,
  size,
  style,
  href,
  startIcon,
  onClick,
}: ButtonProps) => {
  return (
    <MuiButton
      variant={variant ?? 'contained'}
      size={size ?? 'medium'}
      startIcon={startIcon}
      onClick={onClick}
      href={href}
      sx={{
        backgroundColor: dark ? 'black.main' : undefined,
        ...style,
      }}
    >
      <Typography
        variant='button'
        noWrap
        sx={{ color: 'white.main', textTransform: 'none' }}
      >
        {text}
      </Typography>
    </MuiButton>
  )
}

export default Button

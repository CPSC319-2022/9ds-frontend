import React, { FC } from 'react'
import Stack from '@mui/material/Stack'
import sample from '../../assets/sample.jpg'
import { Typography } from '@mui/material'

type AvatarProps = {
  dark?: boolean
}

export const Avatar: FC<AvatarProps> = ({ dark }) => {
  return (
    <Stack
      direction='row'
      alignItems='center'
      maxWidth='fit-content'
      height='42px'
      spacing={8}
      sx={{
        backgroundColor: 'black.30%',
        borderRadius: '39px',
        boxSizing: 'border-box',
        p: '6px',
      }}
    >
      <img
        src={sample}
        width='32px'
        height='32px'
        style={{ borderRadius: '50%' }}
      />
      <Typography variant='caption' color={dark ? 'black.main' : 'white.main'}>
        Emma Watson
      </Typography>
      <Typography variant='small' color={dark ? 'black.main' : 'white.main'}>
        18 Jan 2022
      </Typography>
    </Stack>
  )
}

export default Avatar

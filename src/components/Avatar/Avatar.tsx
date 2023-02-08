import React from 'react'
import Stack from '@mui/material/Stack'
import sample from '../../assets/sample.jpg'
import { Typography } from '@mui/material'

const Avatar = () => {
  return (
    <Stack
      direction='row'
      alignItems='center'
      maxWidth='fit-content'
      spacing={8}
      sx={{
        background: 'black.30%',
        borderRadius: '39px',
        boxSizing: 'border-box',
        p: '6px',
      }}
    >
      <img
        src={sample}
        width='24px'
        height='24px'
        style={{ borderRadius: '50%' }}
      />
      <Typography variant='caption' color='white.main'>
        Emma Watson
      </Typography>
      <Typography variant='small' color='white.main'>
        18 Jan 2022
      </Typography>
    </Stack>
  )
}

export default Avatar

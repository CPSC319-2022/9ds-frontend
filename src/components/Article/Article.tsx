import React, { useContext } from 'react'
import Stack from '@mui/material/Stack'
import sample from '../../assets/sample.jpg'
import { Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import Avatar from '../Avatar/Avatar'

const Article = () => {
  return (
    <Stack
      alignItems='flex-start'
      justifyContent='flex-end'
      width='100%'
      height='500px'
      sx={{
        backgroundImage: `url(${sample})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
        backgroundPosition: 'center center',
      }}
      p='32px'
    >
        <Stack direction="row" >
      <Stack
        sx={{ background: alpha('#3E3636', 0.3) }}
        maxWidth='373px'
        alignItems='flex-start'
      >
        <Typography variant='h5' color='white.main'>
          Featured
        </Typography>
        <Typography variant='title' color='white.main'>
          Article title herer
        </Typography>
        <Typography variant='caption' color='white.main'>
          Article descriptions ble bla lba etc etc ajsdfoiajwoignai
        </Typography>
      </Stack>
      <Avatar />
      </Stack>
    </Stack>
  )
}

export default Article

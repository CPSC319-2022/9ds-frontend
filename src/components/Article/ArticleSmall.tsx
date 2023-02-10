import React, { FC } from 'react'
import Stack from '@mui/material/Stack'
import sample from '../../assets/sample.jpg'
import { Typography } from '@mui/material'
import Avatar from '../Avatar/Avatar'

const ArticleSmall: FC = () => {
  return (
    <Stack
      alignItems='flex-start'
      width='298px'
      borderRadius='12px'
      p='12px'
      spacing={16}
      boxSizing='border-box'
      sx={{ backgroundColor: 'black.25%' }}
    >
      <img
        src={sample}
        width='100%'
        style={{ aspectRatio: 1.75, borderRadius: '12px' }}
      />
      <Stack
        maxWidth='fit-content'
        spacing={10}
        alignItems='flex-start'
        justifyContent='flex-end'
        boxSizing='border-box'
        width='100%'
      >
        <Typography variant='title' color='black.main'>
          Article title here
        </Typography>
        <Typography variant='caption' color='black.main'>
          Article descriptions ble bla lba etc etc ajsdfoiajwoignai
        </Typography>
        <Avatar dark />
      </Stack>
    </Stack>
  )
}

export default ArticleSmall
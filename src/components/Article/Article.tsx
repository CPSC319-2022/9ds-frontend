import React from 'react'
import Stack from '@mui/material/Stack'
import sample from '../../assets/sample.jpg'
import { Typography } from '@mui/material'
import Avatar from '../Avatar/Avatar'
import ArticleSmall from './ArticleSmall'

type ArticleProps = {
  size?: 'large' | 'small'
}
const Article = ({ size }: ArticleProps) => {
  if (size !== 'large') {
    return <ArticleSmall />
  } else {
    return (
      <Stack
        alignItems='flex-start'
        justifyContent='flex-end'
        width='100%'
        borderRadius='12px'
        height='500px'
        sx={{
          backgroundImage: `url(${sample})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100%',
          backgroundPosition: 'center center',
        }}
        p='32px'
        boxSizing='border-box'
      >
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='flex-end'
          width='100%'
        >
          <Stack
            sx={{ backgroundColor: 'black.transparent' }}
            maxWidth='fit-content'
            spacing={10}
            alignItems='flex-start'
            justifyContent='flex-end'
            boxSizing='border-box'
            p='12px'
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
}

export default Article

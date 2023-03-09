import React, { FC } from 'react'
import Stack from '@mui/material/Stack'
import { Typography } from '@mui/material'
import { Avatar } from '../Avatar'
import { ArticlePreview } from '../../hooks/firebase/useArticle'

export interface ArticleLargeProps {
  article: ArticlePreview
}

export const ArticleLarge: FC<ArticleLargeProps> = ({ article }) => {
  return (
    <Stack
      data-testid='root'
      alignItems='flex-start'
      justifyContent='flex-end'
      width='100%'
      borderRadius='12px'
      height='500px'
      sx={{
        backgroundImage: `url(${article.header_image})`,
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
          width='40%'
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
            {article.title}
          </Typography>
          <Typography
            variant='caption'
            color='white.main'
            sx={{
              width: '100%',
              height: '40px',
              overflow: 'hidden',
            }}
          >
            {article.content}
          </Typography>
        </Stack>
        <Avatar
          name={article.author_username}
          date={article.publish_time.toDate()}
          avatarImgSrc={article.author_image}
        />
      </Stack>
    </Stack>
  )
}

import React, { FC } from 'react'
import Stack from '@mui/material/Stack'
import { ButtonBase, Typography } from '@mui/material'
import { Avatar } from '../Avatar'
import { useNavigate } from 'react-router-dom'
import { convertToPlainText } from '../TextEditor'
import { ArticlePreview } from 'types/Article'

export interface ArticleLargeProps {
  article: ArticlePreview
  clickDisabled?: boolean
  notFeatured: boolean
}

export const ArticleLarge: FC<ArticleLargeProps> = ({
  article,
  clickDisabled,
  notFeatured,
}) => {
  const navigate = useNavigate()
  return (
    <ButtonBase
      sx={{ width: '100%' }}
      disabled={clickDisabled}
      onClick={() => {
        navigate(`/blog/${article.articleId}`)
      }}
    >
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
            textAlign='left'
          >
            {!notFeatured && (
              <Typography variant='h5' color='white.main'>
                Featured
              </Typography>
            )}
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
              {convertToPlainText(article.content)}
            </Typography>
          </Stack>
          <Avatar
            name={article.author_username}
            date={article.publish_time.toDate()}
            avatarImgSrc={article.author_image}
          />
        </Stack>
      </Stack>
    </ButtonBase>
  )
}

ArticleLarge.defaultProps = {
  clickDisabled: false,
}

import React, { FC } from 'react'
import Stack from '@mui/material/Stack'
import { ButtonBase, Typography } from '@mui/material'
import { Avatar } from '../Avatar'
import { ArticlePreview } from '../../hooks/firebase/useArticle'
import { useNavigate } from 'react-router-dom'
import { convertToPlainText } from '../TextEditor'

export interface ArticleSmallProps {
  article: ArticlePreview
  clickDisabled?: boolean
}

export const ArticleSmall: FC<ArticleSmallProps> = ({
  article,
  clickDisabled,
}) => {
  const navigate = useNavigate()
  return (
    <ButtonBase
      disabled={clickDisabled}
      onClick={() => {
        navigate(`/blog/${article.articleId}`)
      }}
    >
      <Stack
        alignItems='flex-start'
        width='298px'
        height='400px'
        borderRadius='12px'
        p='12px'
        spacing={16}
        boxSizing='border-box'
        sx={{ backgroundColor: 'black.25%' }}
      >
        <Stack
          sx={{
            display: 'flex',
            height: '100%',
            justifyContent: 'space-between',
            textAlign: 'left',
          }}
        >
          <img
            src={article.header_image}
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
              {article.title}
            </Typography>
            <Typography
              sx={{
                width: '100%',
                height: '40px',
                overflow: 'hidden',
              }}
              variant='caption'
              color='black.main'
            >
              {convertToPlainText(article.content)}
            </Typography>
          </Stack>
          <Avatar
            dark
            name={article.author_username}
            date={article.publish_time.toDate()}
            avatarImgSrc={article.author_image}
          />
        </Stack>
      </Stack>
    </ButtonBase>
  )
}

ArticleSmall.defaultProps = {
  clickDisabled: false,
}

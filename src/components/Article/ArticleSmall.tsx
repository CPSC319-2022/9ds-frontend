import { FC } from 'react'
import Stack from '@mui/material/Stack'
import { ButtonBase, Typography } from '@mui/material'
import { Avatar } from '../Avatar'
import { useNavigate } from 'react-router-dom'
import { convertToPlainText } from '../TextEditor'
import { ArticlePreview } from 'types/Article'

export interface ArticleSmallProps {
  article: ArticlePreview
  clickDisabled?: boolean
  isDraft?: boolean
}

export const ArticleSmall: FC<ArticleSmallProps> = ({
  article,
  clickDisabled,
  isDraft,
}) => {
  const navigate = useNavigate()
  return (
    <ButtonBase
      disabled={clickDisabled}
      onClick={() => {
        if (isDraft) {
          navigate(`/draft/${article.articleId}`)
        } else {
          navigate(`/blog/${article.articleId}`)
        }
      }}
    >
      <Stack
        alignItems='flex-start'
        width='350px'
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
            width: '100%',
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
            spacing={10}
            alignItems='flex-start'
            justifyContent='flex-end'
            boxSizing='border-box'
            width='100%'
          >
            <Typography
              variant='title'
              color='black.main'
              noWrap={true}
              sx={{ width: '100%' }}
            >
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
            date={article.publish_time?.toDate() || new Date()}
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

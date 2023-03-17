import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Article } from '../../components/Article'

import sample from '../../assets/sample.jpg'
import { theme } from '../../theme/Theme'
import { useArticleRead } from '../../hooks/firebase/useArticle'
import { useNavigate, useParams } from 'react-router-dom'
import { convertFromRaw, EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import { AppWrapper } from '../../components/AppWrapper'

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable security/detect-object-injection */

const PAGINATION_COUNT = 5

export const IndividualBlogPost = () => {
  const navigate = useNavigate()

  const { articleId } = useParams()
  const { loading, error, article } = useArticleRead(articleId || '')

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [commentCount, setCommentCount] = useState(1)
  const [comments, setComments] = useState<Array<CommentProps>>([
    { profilePic: sample, comment: 'blasdlklsadads' },
  ])

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  )

  useEffect(() => {
    if (!loading) {
      if (article !== undefined) {
        setTitle(article.title)
        const editState = EditorState.createWithContent(
          convertFromRaw(JSON.parse(article.content)),
        )
        setEditorState(() => editState)
      }
    }
  }, [loading])

  useEffect(() => {
    if (error) {
      navigate('/')
      throw Error('Article does not exist')
    }
  }, [error])

  return (
    <AppWrapper>
      {!loading && article && (
        <>
          <Article
            clickDisabled={true}
            size={'large'}
            article={{
              title: article.title,
              content: article.content,
              header_image: article.header_image,
              author_image: article.author_image,
              author_username: article.author_username,
              publish_time: article.publish_time,
              articleId: articleId || '',
            }}
          />
          <Stack
            direction='column'
            alignItems='flex-start'
            spacing={32}
            alignSelf='stretch'
            paddingLeft={'32px'}
            paddingRight={'32px'}
          >
            <Typography variant='h3'>{title}</Typography>
            <Box
              width={'100%'}
              sx={{
                wordBreak: 'normal',
                padding: '2px 2px',
                alignSelf: 'flex-start',
              }}
            >
              <Editor
                toolbarHidden
                editorState={editorState}
                editorStyle={{ fontFamily: 'Roboto', fontSize: '18px' }}
                readOnly
              />
            </Box>
            <Typography style={{ alignSelf: 'flex-start' }} variant='h6'>
              Comments
            </Typography>
            {new Array(commentCount).fill(0).map((_, i) => {
              return (
                <Comment
                  key={i}
                  profilePic={comments[i].profilePic}
                  comment={comments[i].comment}
                />
              )
            })}
            <Button
              variant='contained'
              style={{
                marginTop: 34,
                backgroundColor: 'black',
                alignSelf: 'center',
                display: commentCount == comments.length ? 'none' : 'block',
              }}
              onClick={() => {
                setCommentCount(
                  commentCount + PAGINATION_COUNT > comments.length
                    ? comments.length
                    : commentCount + PAGINATION_COUNT,
                )
              }}
            >
              LOAD MORE...
            </Button>
            <Stack
              direction='row'
              spacing={28}
              boxSizing='border-box'
              alignItems={'baseline'}
            >
              <img
                src={sample}
                width='42px'
                height='42px'
                style={{ borderRadius: '50%' }}
              />
              <Paper
                style={{
                  borderBottomLeftRadius: 25,
                  borderTopRightRadius: 25,
                  padding: 15,
                  backgroundColor: theme.palette.black['50%'],
                }}
              >
                <TextField
                  multiline
                  variant='standard'
                  placeholder='Comment away...'
                  color='primary'
                />
              </Paper>
            </Stack>
          </Stack>
        </>
      )}
    </AppWrapper>
  )
}
interface CommentProps {
  profilePic: string
  comment: string
}

const Comment = ({ profilePic, comment }: CommentProps) => {
  return (
    <Stack
      direction='row'
      spacing={28}
      boxSizing='border-box'
      alignItems={'baseline'}
    >
      <img
        src={profilePic}
        width='42px'
        height='42px'
        style={{ borderRadius: '50%' }}
      />
      <Paper
        style={{
          borderBottomLeftRadius: 25,
          borderTopRightRadius: 25,
          padding: 15,
          backgroundColor: theme.palette.black['50%'],
        }}
      >
        <Typography color={theme.palette.white.main}>{comment}</Typography>
      </Paper>
    </Stack>
  )
}

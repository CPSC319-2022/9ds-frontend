import { Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { FormEvent, useEffect, useState } from 'react'
import { Article } from '../../components/Article'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import sample from '../../assets/sample.jpg'
import { theme } from '../../theme/Theme'
import { useArticleComments, useArticleRead } from '../../hooks/firebase/useArticle'
import { useNavigate, useParams } from 'react-router-dom'
import { useCommentCreate, comment } from '../../hooks/firebase/useComment'
import { UserData, useUser } from '../../hooks/firebase/useUser'
import { Timestamp } from 'firebase/firestore'

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable security/detect-object-injection */

const PAGINATION_COUNT = 5

export const IndividualBlogPost = () => {
  const navigate = useNavigate()
  const currUser: UserData = useUser().queriedUser

  const { articleId } = useParams()
  const { loading, error, article } = useArticleRead(articleId || '')

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const [currComment, setCurrComment] = useState('')
  const [isCurrCommentError, setIsCurrCommentError] = useState(false)
  const [commentHelperText, setCommentHelperText] = useState('')

  // eslint-disable-next-line
  const articleComments = useArticleComments(articleId!, PAGINATION_COUNT)
  const [comments, setComments] = useState<Array<comment>>(articleComments.comments)
  const [commentCount, setCommentCount] = useState(comments.length)

  const commentCreate = useCommentCreate()

  const handleSubmitComment = (e: FormEvent<HTMLElement>) => {
      const commentToSubmit: comment = {
          commenter_uid: currUser.uid,
          commenter_image: currUser.profile_image,
          commenter_username: currUser.username,
          content: currComment,
          post_time: Timestamp.now()
      }

      if (!currComment.length){
          setIsCurrCommentError(true)
          setCommentHelperText("Comment cannot be empty.")
      } else {
          // eslint-disable-next-line
          commentCreate.createComment(articleId!, commentToSubmit)
          setComments((comments) => [...comments, commentToSubmit])
          setCommentCount(commentCount => commentCount + 1)
          setIsCurrCommentError(false)
          setCommentHelperText("")
          setCurrComment("")
      }
  }

    // useEffect for rerendering the comment pushed
    useEffect(() => {
        // rerender
        console.log("comment updated")
    }, comments)

  useEffect(() => {
    if (!loading) {
      if (article !== undefined) {
        setTitle(article.title)
        setBody(article.content)
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
    <Stack
      direction='column'
      alignItems='center'
      spacing={32}
      boxSizing='border-box'
      p='24px'
    >
      <Header />
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
            <Typography variant='body1'>{body}</Typography>{' '}
            <Typography style={{ alignSelf: 'flex-start' }} variant='h6'>
              Comments
            </Typography>
            {new Array(commentCount).fill(0).map((_, i) => {
              return (
                <Comment
                  key={i}
                  profilePic={comments[i].commenter_image}
                  comment={comments[i].content}
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
              <form
                  onSubmit={(event) => handleSubmitComment(event)}
              >
                <TextField
                  multiline
                  variant='standard'
                  placeholder='Comment away...'
                  color='primary'
                  onChange={(event) =>  setCurrComment(event.target.value)}
                  error={isCurrCommentError}
                  helperText={commentHelperText}
                />
              </form>
              </Paper>
            </Stack>
          </Stack>
        </>
      )}
      <Footer />
    </Stack>
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

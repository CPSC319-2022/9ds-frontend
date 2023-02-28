import { Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Article } from '../../components/Article'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import sample from '../../assets/sample.jpg'
import { theme } from '../../theme/Theme'

const PAGINATION_COUNT = 5

export const IndividualBlogPost = () => {
  const [title, setTitle] = useState('Title')
  const [body, setBody] = useState('Titlasddsadsaadsadsdsaasddsaasddsaasdadse')
  const [commentCount, setCommentCount] = useState(PAGINATION_COUNT)
  const [comments, setComments] = useState<Array<CommentProps>>([
    { profilePic: sample, comment: 'blasdlklsadads' },
    {
      profilePic: sample,
      comment: 'blasdlklsadadsblasdlklsadadsblasdlklsadadsblasdlklsadads',
    },
    { profilePic: sample, comment: 'blasdlklsadadsblasdlklsadads' },
    {
      profilePic: sample,
      comment:
        'blasdlklsadadsblasdlklsadadsblasdlklsadadsblasdlklsadadsblasdlklsadads',
    },
    { profilePic: sample, comment: 'blasdlklsadads' },
    { profilePic: sample, comment: 'blasdlklsadads' },
    {
      profilePic: sample,
      comment: 'blasdlklsadadsblasdlklsadadsblasdlklsadadsblasdlklsadads',
    },
    { profilePic: sample, comment: 'blasdlklsadadsblasdlklsadads' },
    {
      profilePic: sample,
      comment:
        'blasdlklsadadsblasdlklsadadsblasdlklsadadsblasdlklsadadsblasdlklsadads',
    },
    { profilePic: sample, comment: 'blasdlklsadads' },
    { profilePic: sample, comment: 'blasdlklsadads' },
    {
      profilePic: sample,
      comment: 'blasdlklsadadsblasdlklsadadsblasdlklsadadsblasdlklsadads',
    },
    { profilePic: sample, comment: 'blasdlklsadadsblasdlklsadads' },
  ])

  return (
    <Stack
      direction='column'
      alignItems='center'
      spacing={32}
      boxSizing='border-box'
      p='24px'
    >
      <Header />
      <Article size={'large'} />
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

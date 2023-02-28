import { Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Article } from '../../components/Article'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import sample from '../../assets/sample.jpg'
import { theme } from '../../theme/Theme'

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

export const IndividualBlogPost = () => {
  const [title, setTitle] = useState('Title')
  const [body, setBody] = useState('Titlasddsadsaadsadsdsaasddsaasddsaasdadse')

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
        <Comment profilePic={sample} comment={'dasdsaads'} />
        <Button
          variant='contained'
          style={{
            marginTop: 34,
            backgroundColor: 'black',
            alignSelf: 'center',
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
            />
          </Paper>
        </Stack>
      </Stack>
      <Footer />
    </Stack>
  )
}

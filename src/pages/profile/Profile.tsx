import { FC, useContext, useEffect } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Article } from '../../components/Article'
import { LabeledTextField } from '../../components/LabeledTextField'
import {
  useApplyPromotion,
  useUser,
  useUserArticles,
  useUserDrafts,
} from '../../hooks/firebase/useUser'
import { CircularProgress, Box, Button } from '@mui/material'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { NotificationContext } from '../../context'
import { UserType } from '../../components/UserType'

export const Profile: FC = () => {
  const { error, loading, queriedUser } = useUser()
  const {
    articles: UserArticles,
    loading: loadingArticles,
    error: articleError,
  } = useUserArticles(queriedUser.uid, 4)
  const {
    articles: UserDrafts,
    loading: loadingDrafts,
    error: draftError,
  } = useUserDrafts(4)
  const { dispatch } = useContext(NotificationContext)
  const { applyPromotion } = useApplyPromotion()

  useEffect(() => {
    if (error || articleError || draftError) {
      dispatch({
        notificationActionType: 'error',
        message: `Error fetching profile information: ${error}`,
      })
    }
  }, [error, articleError, draftError])

  const handleButtonClick = () => {
    applyPromotion()
  }

  return (
    <Stack direction='column' spacing={32} boxSizing='border-box' p='24px'>
      <Header />
      {loading || loadingArticles || loadingDrafts ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress color='secondary' />
        </Box>
      ) : (
        <>
          <Typography
            variant='h4'
            color='black.main'
            sx={{ paddingLeft: '32px' }}
          >
            Profile
          </Typography>
          <Stack direction='row' spacing={48} boxSizing='border-box' p='24px'>
            <img
              src={queriedUser.profile_image}
              width='140px'
              height='140px'
              style={{ borderRadius: '50%' }}
            />
            <Stack direction='column' spacing={32} width={'auto'}>
              <LabeledTextField
                variant='standard'
                placeholder={queriedUser.role}
                label='Account type'
                multiline={false}
                labelWidth={5}
                text={
                  <Typography variant='title' sx={{ color: 'black' }}>
                    Account Type
                  </Typography>
                }
              />
              <LabeledTextField
                variant='standard'
                placeholder={queriedUser.username}
                label='Name'
                multiline={false}
                labelWidth={5}
                text={
                  <Typography variant='title' sx={{ color: 'black' }}>
                    Name
                  </Typography>
                }
              />
            </Stack>
          </Stack>
          {queriedUser.role !== 'contributor' ? (
            <Stack
              direction='row'
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Button onClick={handleButtonClick}>
                <UserType type='contributor' />
              </Button>
            </Stack>
          ) : (
            <>
              <Typography
                variant='h5'
                color='black.main'
                justifyItems='flex-start'
                sx={{ paddingLeft: '32px' }}
              >
                Posts
              </Typography>
              <Stack direction='row' spacing={16} justifyContent='flex-start'>
                {[...UserArticles].map((article) => (
                  <Article
                    key={article.articleId}
                    size='small'
                    article={article}
                  />
                ))}
              </Stack>
              <Typography
                variant='h5'
                color='black.main'
                sx={{ paddingLeft: '32px' }}
              >
                Drafts
              </Typography>
              <Stack direction='row' spacing={16} justifyContent='flex-start'>
                {[...UserDrafts].map((draft) => (
                  <Article key={draft.articleId} article={draft} />
                ))}
              </Stack>
            </>
          )}
        </>
      )}
      <Footer />
    </Stack>
  )
}

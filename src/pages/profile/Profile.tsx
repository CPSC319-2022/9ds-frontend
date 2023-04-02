import { FC, useContext, useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { LabeledTextField } from '../../components/LabeledTextField'
import {
  useApplyPromotion,
  useUser,
  useUserArticles,
  useUserDrafts,
} from '../../hooks/firebase/useUser'
import { Button } from '@mui/material'
import { NotificationContext } from '../../context/NotificationContext'
import { UserType } from '../../components/UserType'
import { AppWrapper } from '../../components/AppWrapper'
import { handleLoading } from '../../components/Spinner/Spinner'
import { ItemGrid, ItemGridType } from '../../components/ItemGrid'

export const Profile: FC = () => {
  const { error, loading, queriedUser } = useUser()
  const [applied, setApplied] = useState(false);
  const {
    getNext: articleGetNext,
    articles: UserArticles,
    loading: loadingArticles,
    loadingNext: loadingNextArticles,
    error: articleError,
    endOfCollection: articleEnd,
  } = useUserArticles(queriedUser.uid, 4)
  const {
    getNext: draftGetNext,
    articles: UserDrafts,
    loading: loadingDrafts,
    loadingNext: loadingNextDrafts,
    error: draftError,
    endOfCollection: draftEnd,
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
    if(!applied) {
      applyPromotion()
      dispatch({
        notificationActionType: 'success',
        message: `Successfully applied to become contributor, waiting for admin approval!`,
      })
      setApplied(true);
    } else {
      dispatch({
        notificationActionType: 'error',
        message: `You have already applied to become contributor, waiting for admin approval!`,
      })
    }

  }

  const component = (
    <Stack
      direction='column'
      alignItems='flex-start'
      alignSelf='stretch'
      spacing={50}
      paddingLeft={20}
      paddingRight={20}
    >
      <Typography variant='h4' color='black.main'>
        Profile
      </Typography>
      <Stack direction='row' spacing={200} boxSizing='border-box' p='24px'>
        <Stack direction='row' spacing={48} boxSizing='border-box'>
          <img
            src={queriedUser.profile_image}
            width='140px'
            height='140px'
            style={{ borderRadius: '50%' }}
          />
          <Stack direction='column' spacing={32} width={'auto'}>
            <LabeledTextField
              variant='standard'
              value={queriedUser.role}
              label='Account type'
              multiline={false}
              labelWidth={5}
              type='Typography'
              text={
                <Typography variant='title' sx={{ color: 'black' }}>
                  Account Type
                </Typography>
              }
            />
            <LabeledTextField
              variant='standard'
              value={queriedUser.username}
              type='Typography'
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
        {queriedUser.role == 'reader' && (
          <Stack direction='row'>
            <Button onClick={handleButtonClick}>
              <UserType type='contributor' />
            </Button>
          </Stack>
        )}
      </Stack>
      {queriedUser.role !== 'reader' && (
        <>
          <Typography variant='h5' color='black.main' justifyItems='flex-start'>
            Posts
          </Typography>
          <ItemGrid items={UserArticles} type={ItemGridType.ARTICLES} />
          {!articleEnd && (
            <Button
              variant='contained'
              size='large'
              color='primary'
              sx={{
                alignSelf: 'center',
              }}
              disabled={loadingNextArticles}
              onClick={() => {
                articleGetNext(4)
              }}
            >
              LOAD MORE...
            </Button>
          )}

          <Typography variant='h5' color='black.main'>
            Drafts
          </Typography>
          <ItemGrid items={UserDrafts} type={ItemGridType.DRAFTS} />
          {!draftEnd && (
            <Button
              variant='contained'
              size='large'
              color='primary'
              sx={{
                alignSelf: 'center',
              }}
              disabled={loadingNextDrafts}
              onClick={() => {
                draftGetNext(4)
              }}
            >
              LOAD MORE...
            </Button>
          )}
        </>
      )}
    </Stack>
  )

  return (
    <AppWrapper>
      {handleLoading(loading || loadingArticles || loadingDrafts, component)}
    </AppWrapper>
  )
}

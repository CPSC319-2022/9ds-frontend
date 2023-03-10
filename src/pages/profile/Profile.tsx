import { FC } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Article } from '../../components/Article'
import { LabeledTextField } from '../../components/LabeledTextField'
import { useUser } from '../../hooks/firebase/useUser'
import { CircularProgress, Box } from '@mui/material'
import { Footer, Header } from '../../components'

export const Profile: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {error, loading, queriedUser} = useUser();
  return (
    <Stack direction='column' spacing={32} boxSizing='border-box' p='24px'>
      <Header />
      {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
      <><Typography variant='h4' color='black.main' sx={{ paddingLeft: '32px' }}>
            Profile
          </Typography><Stack direction='row' spacing={48} boxSizing='border-box' p='24px'>
              <img
                src={queriedUser.profile_image}
                width='140px'
                height='140px'
                style={{ borderRadius: '50%' }} />
              <Stack direction='column' spacing={32}>
                <LabeledTextField
                  variant='standard'
                  placeholder={queriedUser.role}
                  label='Account type'
                  multiline={false}
                  spacing={32}
                  text={<Typography variant='title' sx={{ color: 'black' }}>Account Type</Typography>} />
                <LabeledTextField
                  variant='standard'
                  placeholder={queriedUser.username}
                  label='Name'
                  multiline={false}
                  spacing={32}
                  text={<Typography variant='title' sx={{ color: 'black' }}>Name</Typography>} />
                <LabeledTextField
                  variant='standard'
                  placeholder='emma@watson.com'
                  label='Email'
                  multiline={false}
                  spacing={32}
                  text={<Typography variant='title' sx={{ color: 'black' }}>Email</Typography>} />
              </Stack>
            </Stack><Typography
              variant='h5'
              color='black.main'
              justifyItems='flex-start'
              sx={{ paddingLeft: '32px' }}
            >
              Posts
            </Typography><Stack direction='row' spacing={16} justifyContent='flex-start'>
              {[...Array(4).keys()].map((key) => (
                <Article key={key} size='small' />
              ))}
            </Stack><Typography variant='h5' color='black.main' sx={{ paddingLeft: '32px' }}>
              Drafts
            </Typography><Stack direction='row' spacing={16} justifyContent='flex-start'>
              {[...Array(4).keys()].map((key) => (
                <Article key={key} size='small' />
              ))}
            </Stack></>
       )}
      <Footer/>
    </Stack>
    

  )
}

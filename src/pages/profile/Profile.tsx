import { FC, useState } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Article } from '../../components/Article'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import profile from '../../assets/profile.png'
import { LabeledTextField } from '../../components/LabeledTextField'

export const Profile: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [profileInfo, setProfileInfo] = useState('') // temp hook

  return (
    <Stack direction='column' spacing={32} boxSizing='border-box' p='24px'>
      <Header />
      <Typography variant='h4' color='black.main' sx={{ paddingLeft: '32px' }}>
        Profile
      </Typography>
      <Stack direction='row' spacing={48} boxSizing='border-box' p='24px'>
        <img
          src={profile}
          width='140px'
          height='140px'
          style={{ borderRadius: '50%' }}
        />
        <Stack direction='column' spacing={32}>
          <LabeledTextField
            variant='standard'
            onTextChange={setProfileInfo}
            placeholder='Contributor'
            label='Account type'
            multiline={false}
            spacing={32}
            flex={0.7}
            typographyVariant='title'
          />
          <LabeledTextField
            variant='standard'
            onTextChange={setProfileInfo}
            placeholder='Emma Watson'
            label='Name'
            multiline={false}
            spacing={32}
            flex={0.7}
            typographyVariant='title'
          />
          <LabeledTextField
            variant='standard'
            onTextChange={setProfileInfo}
            placeholder='emma@watson.com'
            label='Email'
            multiline={false}
            spacing={32}
            flex={0.7}
            typographyVariant='title'
          />
        </Stack>
      </Stack>
      <Typography
        variant='h5'
        color='black.main'
        justifyItems='flex-start'
        sx={{ paddingLeft: '32px' }}
      >
        Posts
      </Typography>
      <Stack direction='row' spacing={16} justifyContent='center'>
        {[...Array(4).keys()].map((key) => (
          <Article key={key} size='small' />
        ))}
      </Stack>
      <Typography variant='h5' color='black.main' sx={{ paddingLeft: '32px' }}>
        Drafts
      </Typography>
      <Stack direction='row' spacing={16} justifyContent='center'>
        {[...Array(4).keys()].map((key) => (
          <Article key={key} size='small' />
        ))}
      </Stack>
      <Footer />
    </Stack>
  )
}

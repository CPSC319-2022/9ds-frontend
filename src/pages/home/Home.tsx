import React, { FC } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Article } from '../../components/Article'
import { AppWrapper } from '../../components/AppWrapper'
import { Button } from '../../components/Button'
import { UserType } from '../../components/UserType'

export const Home: FC = () => {
  return (
    <AppWrapper>
      <Article size='large' />
      <Stack direction='column' spacing={32} width='100%' alignItems='center'>
        <Typography
          variant='h4'
          color='black.main'
          sx={{ alignSelf: 'flex-start' }}
        >
          Recent posts
        </Typography>
        <Stack direction='row' spacing={16}>
          {[...Array(4).keys()].map((key) => (
            <Article key={key} size='small' />
          ))}
        </Stack>
        <Button dark text='Load more...' size='large' />
      </Stack>
      <Stack direction='column' spacing={32} width='100%' alignItems='center'>
        <Typography
          variant='h4'
          color='black.main'
          sx={{ alignSelf: 'flex-start' }}
        >
          Unlock more by signing up
        </Typography>
        <Stack direction='row' spacing={32} maxWidth='780px' width='100%'>
          <UserType type='reader' />
          <UserType type='contributor' />
        </Stack>
      </Stack>
    </AppWrapper>
  )
}

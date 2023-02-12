import React, { FC } from 'react'
import Stack from '@mui/material/Stack'
import { ReactComponent as Glasses } from '../../assets/glasses.svg'
import { ReactComponent as Pencil } from '../../assets/pencil.svg'
import Typography from '@mui/material/Typography'

type UserTypeProps = {
  type?: 'reader' | 'contributor'
}

export const UserType: FC<UserTypeProps> = ({ type }) => {
  const reader = type && type === 'reader'
  return (
    <Stack
      direction='column'
      alignItems='center'
      width='100%'
      boxSizing='border-box'
      p='32px'
      sx={{
        borderRadius: '12px',
        border: '3px solid',
        borderColor: 'primary.50%',
        gap: '32px',
      }}
    >
      <Typography variant='h5' color='black.main'>
        Become a {reader ? ' Reader' : ' Contributor'}
      </Typography>
      {reader ? <Glasses /> : <Pencil />}
    </Stack>
  )
}

import React, { FC } from 'react'
import Stack from '@mui/material/Stack'
import { ReactComponent as Glasses } from '../../assets/glasses.svg'
import { ReactComponent as Pencil } from '../../assets/pencil.svg'
import Typography from '@mui/material/Typography'

type UserTypeProps = {
  type: 'reader' | 'contributor'
}

export const UserType: FC<UserTypeProps> = ({ type }) => {
  const reader = type === 'reader'
  return (
    <Stack
      direction='column'
      alignItems='center'
      width='374'
      height='150px'
      boxSizing='border-box'
      p='32px'
      sx={{
        borderRadius: '12px',
        border: '3px solid',
        borderColor: 'primary.50%',
        gap: '8px',
      }}
    >
      <Typography variant='title' color='black.main'>
        Become a {reader ? ' Reader' : ' Contributor'}
      </Typography>
      {reader ? <Glasses /> : <Pencil />}
    </Stack>
  )
}

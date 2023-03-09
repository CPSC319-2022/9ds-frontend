import React, { FC } from 'react'
import Stack from '@mui/material/Stack'
import { Typography } from '@mui/material'
import { dateFormatPretty } from '../../utils/dateUtils'

type AvatarProps = {
  name: string
  date: Date
  avatarImgSrc: string
  dark?: boolean
}

export const Avatar: FC<AvatarProps> = ({ dark, name, date, avatarImgSrc }) => {
  return (
    <Stack
      direction='row'
      alignItems='center'
      maxWidth='fit-content'
      height='42px'
      spacing={8}
      sx={{
        backgroundColor: 'black.30%',
        borderRadius: '39px',
        boxSizing: 'border-box',
        p: '6px',
      }}
    >
      <img
        src={avatarImgSrc}
        width='32px'
        height='32px'
        style={{ borderRadius: '50%' }}
      />
      <Typography
        variant='caption'
        data-testid='avatarName'
        color={dark ? 'black.main' : 'white.main'}
      >
        {name}
      </Typography>
      <Typography
        variant='small'
        data-testid='avatarDate'
        color={dark ? 'black.main' : 'white.main'}
      >
        {dateFormatPretty(date)}
      </Typography>
    </Stack>
  )
}

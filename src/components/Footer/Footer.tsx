import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import feather from '../../assets/feather.png'
import logo from '../../assets/logo.png'
import React, { FC, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../Button/Button'
import { useApplyPromotion } from '../../hooks/firebase/useUser'
import { NotificationContext } from '../../context/NotificationContext'

export enum UserRole {
  READER = 'reader',
  CONTRIBUTOR = 'contributor',
  ADMIN = 'admin',
  VISITOR = 'visitor',
}

interface FooterProps {
  role: UserRole
}

export const Footer: FC<FooterProps> = ({ role }: FooterProps) => {
  const applyContributor = useApplyPromotion()
  const { dispatch } = useContext(NotificationContext)

  return (
    <Stack
      spacing={32}
      width='100%'
      p='24px 32px 16px'
      boxSizing='border-box'
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black.main',
        borderRadius: '12px',
      }}
    >
      <Stack
        spacing={0.5}
        direction='row'
        justifyContent='center'
        alignItems='flex-end'
      >
        <Typography variant='h5' color='white.main'>
          Start by writing something simple
        </Typography>
        <img src={feather} width='80rem' height='60rem' />
      </Stack>
      {role === UserRole.VISITOR && (
        <Link to={'/get-started'} style={{ textDecoration: 'none' }}>
          <Button
            variant='outlined'
            style={{ color: 'white.main', height: '60px', width: '140px' }}
            text='Get started'
            size='large'
          />
        </Link>
      )}
      {role === UserRole.READER && (
        <Button
          variant='outlined'
          style={{ color: 'white.main', height: '66px', width: '266.67px' }}
          text='Become a contributor'
          size='large'
          onClick={() => {
            applyContributor.applyPromotion()
            dispatch({
              notificationActionType: 'success',
              message: `Successfully applied to become contributor!`,
            })
          }}
        />
      )}
      {(role === UserRole.ADMIN || role === UserRole.CONTRIBUTOR) && (
        <Link to={'/create'} style={{ textDecoration: 'none' }}>
          <Button
            variant='outlined'
            style={{ color: 'white.main', height: '66px', width: '153.67px' }}
            text='Create blog'
            size='large'
          />
        </Link>
      )}

      <Stack
        spacing={5}
        direction='row'
        width='100%'
        m='0 64px'
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <img src={logo} width='60rem' height='35rem' />
        <Stack spacing={32} direction='row' sx={{ alignItems: 'center' }}>
          <Link to={'/'} style={{ textDecoration: 'none' }}>
            <Typography variant='caption' color='white.main'>
              Home
            </Typography>
          </Link>
          <Link to={'/about-us'} style={{ textDecoration: 'none' }}>
            <Typography variant='caption' color='white.main'>
              About Us
            </Typography>
          </Link>
          {role !== UserRole.VISITOR && (
            <Link to={'/profile'} style={{ textDecoration: 'none' }}>
              <Typography variant='caption' color='white.main'>
                Profile
              </Typography>
            </Link>
          )}
        </Stack>
        <Typography variant='small' color='white.main'>
          @2023
        </Typography>
      </Stack>
    </Stack>
  )
}

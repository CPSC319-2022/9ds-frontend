import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import logo from '../../assets/logo.png'
import React, { FC } from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'

export const Header: FC = () => {
  return (
    <Stack
      border='2px solid black'
      width='100%'
      borderRadius='12px'
      height='84px'
      direction='row'
      p='16px 32px'
      boxSizing='border-box'
      sx={{ justifyContent: 'space-between', alignItems: 'center' }}
    >
      <img src={logo} width='100px' height='50px' />
      <Stack
        spacing={32}
        direction='row'
        sx={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <Link to={'/'} style={{ textDecoration: 'none' }}>
          <Typography variant='subheading' color='black.main'>
            HOME
          </Typography>
        </Link>
        <a href='/#recentPosts' style={{ textDecoration: 'none' }}>
          <Button
            variant='text'
            size='large'
            sx={{
              textTransform: 'none',
            }}
          >
            <Typography variant='subheading' color='black.main'>
              BLOG
            </Typography>
          </Button>
        </a>
        <Link to={'/about-us'} style={{ textDecoration: 'none' }}>
          <Typography variant='subheading' color='black.main'>
            ABOUT US
          </Typography>
        </Link>
      </Stack>
      <Link to={'/get-started'} style={{ textDecoration: 'none' }}>
        <Button
          variant='outlined'
          size='large'
          sx={{
            backgroundColor: 'black.main',
            textTransform: 'none',
            border: `2px solid 'black'`,
            ':hover': {
              bgcolor: '#4D3188',
            },
          }}
        >
          <Typography variant='button' color='white.main'>
            LOGIN/SIGN UP
          </Typography>
        </Button>
      </Link>
    </Stack>
  )
}

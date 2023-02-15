import { Card, CardContent, Typography, Button } from '@mui/material'
import { Stack } from '@mui/system'
import feather from '../assets/feather.png'
import logo from '../assets/logo.png'
import React from 'react'

export function SignInFooter() {
  return (
    <Card
      sx={{
        maxWidth: '1000px',
        minWidth: '500px',
        height: '220px',
        borderRadius: '15px',
        bgcolor: 'black.main',
        color: 'white.main',
      }}
    >
      <CardContent>
        <Stack
          spacing={20}
          sx={{ justifyContent: 'center', alignItems: 'space-evenly' }}
        >
          <Stack
            spacing={0.5}
            direction='row'
            justifyContent='center'
            alignItems='flex-end'
          >
            <Typography variant='h5'>
              Start by writing something simple
            </Typography>
            <img src={feather} width='80rem' height='60rem' />
          </Stack>
          <Stack
            direction='row'
            sx={{ justifyContent: 'center', alignItems: 'flex-end' }}
          >
            <Button
              variant='outlined'
              style={{
                fontWeight: 'button.fontWeight',
                fontSize: 'button.fontSize',
                lineHeight: 'button.lineHeight',
                letterSpacing: 'button.letterSpacing',
                color: 'white',
                borderColor: 'white',
              }}
            >
              Get Started
            </Button>
          </Stack>
          <Stack
            spacing={5}
            direction='row'
            sx={{ justifyContent: 'space-around', alignItems: 'center' }}
          >
            <img src={logo} width='60rem' height='35rem' />
            <Stack
              spacing={3}
              direction='row'
              sx={{ justifyContent: 'center', alignItems: 'center' }}
            >
              <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                Home
              </Typography>
              <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                About Us
              </Typography>
              <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                Blog
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: '8px', p: '15px' }}>@2023</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

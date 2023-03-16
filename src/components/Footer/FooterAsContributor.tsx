import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import feather from '../../assets/feather.png'
import logo from '../../assets/logo.png'
import React, { FC } from 'react'
import { Link } from "react-router-dom";
import { Button } from '../Button/Button'

export const FooterAsContributor: FC = () => {
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
            <Link to={"/create"} style={{ textDecoration: 'none' }}>
                <Button
                    variant='outlined'
                    style={{ color: 'white.main', height: '66px', width: '153.67px' }}
                    text='CREATE BLOG'
                    size='large'
                />
            </Link>

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
                    <Link to={"/"} style={{ textDecoration: 'none' }}>
                        <Typography variant='caption' color='white.main'>
                            Home
                        </Typography>
                    </Link>
                    <Link to={"/about-us"} style={{ textDecoration: 'none' }}>
                        <Typography variant='caption' color='white.main'>
                            About Us
                        </Typography>
                    </Link>
                    <Link to={"/create"}>
                        <Typography variant='caption' color='white.main'>
                            Blog
                        </Typography>
                    </Link>
                    <Link to={"/profile"} style={{ textDecoration: 'none' }}>
                        <Typography variant='caption' color='white.main'>
                            Profile
                        </Typography>
                    </Link>
                </Stack>
                <Typography variant='small' color='white.main'>
                    @2023
                </Typography>
            </Stack>
        </Stack>
    )
}
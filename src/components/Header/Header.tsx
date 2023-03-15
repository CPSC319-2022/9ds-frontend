import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import logo from '../../assets/logo.png'
import React, { FC } from 'react'
import { Button } from '../Button'
import { Link } from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

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
        <Link to={"/"} style={{ textDecoration: 'none' }}>
            <Typography variant='subheading' color="black.main">HOME</Typography>
        </Link>
        <Stack direction='row' spacing={4} alignItems='center'>
          <Typography variant='subheading' color="black.main">BLOG</Typography>
          <KeyboardArrowDownIcon />
        </Stack>
        <Link to={"/ROUTE_CONFIG.aboutUs.path"} style={{ textDecoration: 'none' }}>
            <Typography variant='subheading' color="black.main">ABOUT US</Typography>
        </Link>
      </Stack>
      <Stack
        direction='row'
        spacing={12}
        sx={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <Link to={"/login"} style={{ textDecoration: 'none' }}>
            <Button variant='outlined' text='Login' dark size='large' />
        </Link>
        <Link to={"/login"} style={{ textDecoration: 'none' }}>
            <Button dark text='Sign up' size='large' />
        </Link>
      </Stack>
    </Stack>
  )
}

import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import logo from '../../assets/logo.png'
import React, { FC } from 'react'
import { Button } from '../Button'
import { Link } from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { UserData, useUser } from '../../hooks/firebase/useUser'

const renderButtonOrProfileImage: FC = () => {
    const user: UserData = useUser().queriedUser
    if (user.username !== "") {
        return (
            <img
            src={user.profile_image}
            width='55px'
            height='55px'
            style={{borderRadius: '50%', objectFit: 'cover'}}
            />
        )
    } else {
        return (
            <>
                <Link to={'/login'} style={{textDecoration: 'none'}}>
                <Button dark text="LOGIN/SIGN UP" size="large"/>
                </Link>
            </>
        )
    }
}


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
        <Link to={"/about-us"} style={{ textDecoration: 'none' }}>
            <Typography variant='subheading' color="black.main">ABOUT US</Typography>
        </Link>
      </Stack>
      {renderButtonOrProfileImage({})}
    </Stack>
  )
}

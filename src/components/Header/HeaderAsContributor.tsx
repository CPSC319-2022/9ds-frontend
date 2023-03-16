import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import logo from '../../assets/logo.png'
import React, {FC} from 'react'
import {Link, useNavigate} from 'react-router-dom';
import {useUser} from '../../hooks/firebase/useUser'
import {useSignOut} from '../../hooks/firebase/useAuth'

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const HeaderAsContributor: FC = () => {
    const user = useUser().queriedUser
    const signOut = useSignOut()
    const navigate = useNavigate()

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <Stack
            border="2px solid black"
            width="100%"
            borderRadius="12px"
            height="84px"
            direction="row"
            p="16px 32px"
            boxSizing="border-box"
            sx={{justifyContent: 'space-between', alignItems: 'center'}}
        >
            <img src={logo} width="100px" height="50px"/>
            <Stack
                spacing={32}
                direction="row"
                sx={{justifyContent: 'center', alignItems: 'center'}}
            >
                <Link to={'/'} style={{textDecoration: 'none'}}>
                    <Typography variant="subheading" color="black.main">HOME</Typography>
                </Link>

                <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    endIcon={<KeyboardArrowDownIcon/>}
                >
                    <Typography variant="button" color="black.main">BLOG</Typography>
                </Button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem
                        sx={{
                            ':hover': {
                                bgcolor: '#A292C5'
                            }
                        }}
                        onClick={() => navigate('/create')}
                    >
                        <Typography variant="subheading" color="black.main">CREATE BLOG POST</Typography>
                    </MenuItem>
                    <MenuItem
                        sx={{
                            ':hover': {
                                bgcolor: '#A292C5'
                            }
                        }}
                        onClick={() => navigate('/profile')}
                    >
                        <Typography variant="subheading" color="black.main">PROFILE</Typography>
                    </MenuItem>
                </Menu>
                <Link to={'/about-us'} style={{textDecoration: 'none'}}>
                    <Typography variant="subheading" color="black.main">ABOUT US</Typography>
                </Link>
            </Stack>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={20}
            >
                <Link to={'/profile'}>
                    <img
                        src={user.profile_image}
                        width="55px"
                        height="55px"
                        style={{borderRadius: '50%', objectFit: 'cover'}}/>
                </Link>
                <Button
                    variant="outlined"
                    size="large"
                    sx={{
                        backgroundColor: 'black.main',
                        textTransform: 'none',
                        border: `2px solid 'black'`,
                        ':hover': {
                            bgcolor: '#4D3188'
                        }
                    }}
                    onClick={() => {
                        signOut.signOutWrapper()
                        navigate('/login')
                    }}
                >
                    <Typography variant="button" color="white.main">SIGN OUT</Typography>
                </Button>
            </Stack>
        </Stack>
    )
}

import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import logo from '../../assets/logo.png'
import React, { FC } from 'react'
import Button from '@mui/material/Button'
import { Link, useNavigate } from 'react-router-dom'
import { MenuItem, Paper, Popper } from '@mui/material'
import { useUser } from '../../hooks/firebase/useUser'
import { useSignOut } from '../../hooks/firebase/useAuth'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

export enum UserRole {
  READER = 'reader',
  CONTRIBUTOR = 'contributor',
  ADMIN = 'admin',
  VISITOR = 'visitor',
}

interface HeaderProps {
  role: UserRole
}

export const Header: FC<HeaderProps> = ({ role }: HeaderProps) => {
  const user = useUser().queriedUser
  const signOut = useSignOut()
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [open, setOpen] = React.useState<boolean>(false)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(!open)
    setAnchorEl(event.currentTarget)
  }

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

        {role === UserRole.VISITOR ? (
          <Link to={'/'} style={{ textDecoration: 'none' }}>
            <Typography variant='subheading' color='black.main'>
              BLOG
            </Typography>
          </Link>
        ) : (
          <Button
            id='basic-button'
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
          >
            <Typography variant='button' color='black.main'>
              BLOG
            </Typography>
          </Button>
        )}

        <Popper id='basic-menu' anchorEl={anchorEl} open={open}>
          <Paper>
            {(role === UserRole.ADMIN || role === UserRole.CONTRIBUTOR) && (
              <MenuItem
                sx={{
                  ':hover': {
                    bgcolor: '#A292C5',
                  },
                }}
                onClick={() => navigate('/create')}
              >
                <Typography variant='subheading' color='black.main'>
                  CREATE BLOG POST
                </Typography>
              </MenuItem>
            )}
            <MenuItem
              sx={{
                ':hover': {
                  bgcolor: '#A292C5',
                },
              }}
              onClick={() => navigate('/profile')}
            >
              <Typography variant='subheading' color='black.main'>
                PROFILE
              </Typography>
            </MenuItem>
          </Paper>
        </Popper>
        {role === UserRole.ADMIN && (
          <Link to={'/admin'} style={{ textDecoration: 'none' }}>
            <Typography variant='subheading' color='black.main'>
              ADMIN PANEL
            </Typography>
          </Link>
        )}
        <Link to={'/about-us'} style={{ textDecoration: 'none' }}>
          <Typography variant='subheading' color='black.main'>
            ABOUT US
          </Typography>
        </Link>
      </Stack>
      <Stack
        direction='row'
        justifyContent='center'
        alignItems='center'
        spacing={20}
      >
        {role !== UserRole.VISITOR && (
          <Link to={'/profile'}>
            <img
              src={user.profile_image}
              width='55px'
              height='55px'
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          </Link>
        )}
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
          onClick={() => {
            if (role === UserRole.VISITOR) {
              navigate('/get-started')
            } else {
              signOut.signOutWrapper()
              navigate('/get-started')
            }
          }}
        >
          <Typography variant='button' color='white.main'>
            {role !== UserRole.VISITOR ? 'SIGN OUT' : 'LOGIN/SIGN UP'}
          </Typography>
        </Button>
      </Stack>
    </Stack>
  )
}

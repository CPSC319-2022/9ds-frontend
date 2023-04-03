import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import logo from '../../assets/logo.png'
import { FC } from 'react'
import Button from '@mui/material/Button'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/firebase/useUser'
import { useSignOut } from '../../hooks/firebase/useAuth'

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
      <img data-testid='logo' src={logo} width='100px' height='50px' />
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

        {role !== UserRole.VISITOR && role !== UserRole.READER && (
          <Link to={'/create'} style={{ textDecoration: 'none' }}>
            <Typography variant='subheading' color='black.main'>
              CREATE BLOG POST
            </Typography>
          </Link>
        )}

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
          data-testid='sign-out-btn'
          sx={{
            backgroundColor: 'black.main',
            textTransform: 'none',
            border: `2px solid 'black'`,
            ':hover': {
              bgcolor: '#4D3188',
            },
          }}
          onClick={async () => {
            if (role === UserRole.VISITOR) {
              navigate('/get-started')
            } else {
              await signOut.signOutWrapper()
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

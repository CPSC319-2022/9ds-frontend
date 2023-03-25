import React, { FC, ReactNode } from 'react'
import { Header, UserRole } from '../Header'
import { Footer } from '../Footer'
import { FooterAsReader } from '../Footer/FooterAsReader'
import { FooterAsContributor } from '../Footer/FooterAsContributor'
import Stack from '@mui/material/Stack'
import { useUser } from '../../hooks/firebase/useUser'

export interface IProps {
  children: ReactNode
  spacing?: number
}

export const AppWrapper: FC<IProps> = ({ children, spacing }) => {
  const space = !spacing ? 32 : spacing
  // const user = useUser().queriedUser
  const user = {
    role: '',
    profile_image: '',
    username: '',
    uid: ''
  }

  const HeaderComponent: FC = () => {
    if (user.role === 'reader') {
      return <Header role={UserRole.READER} />
    }
    if (user.role === 'contributor') {
      return <Header role={UserRole.CONTRIBUTOR} />
    }
    if (user.role === 'admin') {
      return <Header role={UserRole.ADMIN} />
    }
    return <Header role={UserRole.VISITOR} />
  }

  const FooterComponent: FC = () => {
    if (user.role === 'reader') {
      return <Footer role={UserRole.READER} />
    }
    if (user.role === 'contributor') {
      return <Footer role={UserRole.CONTRIBUTOR} />
    }
    if (user.role === 'admin') {
      return <Footer role={UserRole.ADMIN} />
    }
    return <Footer role={UserRole.VISITOR} />
  }

  return (
    <Stack
      data-testid='app-wrapper-stack'
      direction='column'
      alignItems='center'
      spacing={space}
      boxSizing='border-box'
      p='24px'
    >
      <HeaderComponent />
      {children}
      <FooterComponent />
    </Stack>
  )
}

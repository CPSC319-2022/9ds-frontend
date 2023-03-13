import React, {FC, ReactNode} from 'react'
import { Header } from "../Header";
import { Footer } from '../Footer';
import Stack from '@mui/material/Stack'
import {useAuth} from '../../hooks/firebase/useAuth'

export interface IProps {
  children: ReactNode;
  spacing?: number
}

const renderFooter: any = () => {
    const state = useAuth()
    if (!state.user) {
        return (<Footer/>)
    }
}

export const AppWrapper: FC<IProps> = ({children, spacing}) => {
    const space = !spacing ? 32 : spacing 
  return (
    <Stack
      direction='column'
      alignItems='center'
      spacing={space}
      boxSizing='border-box'
      p='24px'
    >
      <Header/>
      {children}
      {renderFooter()}
    </Stack>
  )
}
import React, {FC, ReactNode} from 'react'
import { Header } from "../Header";
import { Footer } from '../Footer';
import Stack from '@mui/material/Stack'
import {useUser} from '../../hooks/firebase/useUser'

export interface IProps {
  children: ReactNode;
  spacing?: number
}

// eslint-disable-next-line
const renderFooter: any = () => {
    const user = useUser().queriedUser
    if (user.username === "") {
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
import React, {FC, ReactNode} from 'react'
import { Header } from "../Header";
import { Footer } from '../Footer';
import Stack from '@mui/material/Stack'

export interface IProps {
  children: ReactNode;
  spacing?: number
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
      <Footer/>
    </Stack>
  )
}

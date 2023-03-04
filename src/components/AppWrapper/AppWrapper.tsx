import React, {FC, ReactNode} from 'react'
import { Header } from "../Header";
import { Footer } from '../Footer';
import Stack from '@mui/material/Stack'

export interface IProps {
  children: ReactNode;
}

export const AppWrapper: FC<IProps> = (props) => {
  return (
    <Stack
      direction='column'
      alignItems='center'
      spacing={32}
      boxSizing='border-box'
      p='24px'
    >
      <Header/>
      {props.children}
      <Footer/>
    </Stack>
  )
}

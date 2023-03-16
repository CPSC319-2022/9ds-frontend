import React, {FC, ReactNode} from 'react'
import { Header } from "../Header";
import { HeaderAsAdmin } from "../Header/HeaderAsAdmin"
import { HeaderAsContributor } from "../Header/HeaderAsContributor"
import { Footer } from '../Footer';
import { FooterAsReader } from '../Footer/FooterAsReader'
import { FooterAsContributor } from '../Footer/FooterAsContributor'
import Stack from '@mui/material/Stack'
import {useUser} from '../../hooks/firebase/useUser'

export interface IProps {
  children: ReactNode;
  spacing?: number
}

export const AppWrapper: FC<IProps> = ({children, spacing}) => {
    const space = !spacing ? 32 : spacing
    const user = useUser().queriedUser
    // eslint-disable-next-line
    const renderHeader: any = () => {
        if (user.role === "" || user.role === "reader") {
            return (<Header/>)
        }
        if (user.role === "contributor") {
            return (<HeaderAsContributor/>)
        }
        if (user.role === "admin") {
            return (<HeaderAsAdmin/>)
        }
    }

    // eslint-disable-next-line
    const renderFooter: any = () => {
        if (user.role === "") {
            return (<Footer/>)
        }
        if (user.role === "reader") {
            return (<FooterAsReader/>)
        }
        if (user.role === "contributor" || user.role === "admin") {
            return (<FooterAsContributor/>)
        }
    }
  return (
    <Stack
      direction='column'
      alignItems='center'
      spacing={space}
      boxSizing='border-box'
      p='24px'
    >
      {renderHeader()}
      {children}
      {renderFooter()}
    </Stack>
  )
}
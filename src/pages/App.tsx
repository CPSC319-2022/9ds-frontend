import ThemeProvider from '@mui/material/styles/ThemeProvider'
import Home from '../pages/home/Home'
import React from 'react'
import { theme } from '../theme/Theme'

// TODO remove later
import {LoginAndSignup} from "./login/LoginAndSignup";

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <LoginAndSignup />
    </ThemeProvider>
  )
}

import ThemeProvider from '@mui/material/styles/ThemeProvider'
import Home from '../pages/home/Home'
import React from 'react'
import { theme } from '../theme/Theme'
import {LoginAndSignup} from "./login/LoginAndSignup";
import {GetStarted} from "./login/GetStarted"
import {Home} from "./home";

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>
  )
}

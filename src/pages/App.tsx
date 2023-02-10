import ThemeProvider from '@mui/material/styles/ThemeProvider'
import Home from '../pages/home/Home'
import Login from '../pages/login/Login'
import React from 'react'
import { theme } from '../theme/Theme'

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
        {/*// change to Home later*/}
      <Login />
    </ThemeProvider>
  )
}

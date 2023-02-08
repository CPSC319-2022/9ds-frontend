import ThemeProvider from '@mui/material/styles/ThemeProvider'
import React from 'react'
import { theme } from '../theme/Theme'

export const App = () => {
  return <ThemeProvider theme={theme}></ThemeProvider>
}

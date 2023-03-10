import ThemeProvider from '@mui/material/styles/ThemeProvider'
import React from 'react'
import { theme } from '../theme/Theme'
import { AppRouter } from './AppRouter'

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppRouter />
    </ThemeProvider>
  )
}

import ThemeProvider from '@mui/material/styles/ThemeProvider'
import React from 'react'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { NotificationSnackbar } from '../components/Snackbar'
import { NotificationProvider } from '../context'
import { theme } from '../theme/Theme'
import { AppRouter } from './AppRouter'

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <NotificationSnackbar />
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </NotificationProvider>
    </ThemeProvider>
  )
}

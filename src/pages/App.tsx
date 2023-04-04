import ThemeProvider from '@mui/material/styles/ThemeProvider'
import React from 'react'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { NotificationSnackbar } from '../components/Snackbar'
import { NotificationProvider } from '../context/NotificationContext'
import { AuthProvider } from '../context/AuthContext'
import { theme } from '../theme/Theme'
import { AppRouter } from './AppRouter'
import { UserProvider } from 'context/UserContext'

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <UserProvider>
          <NotificationProvider>
            <NotificationSnackbar />
            <ErrorBoundary>
              <AppRouter />
            </ErrorBoundary>
          </NotificationProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

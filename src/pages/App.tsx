import ThemeProvider from '@mui/material/styles/ThemeProvider'
import { theme } from '../theme/Theme'

export const App = () => {
  return <ThemeProvider theme={theme}></ThemeProvider>
}

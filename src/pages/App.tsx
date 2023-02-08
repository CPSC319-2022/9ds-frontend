import ThemeProvider from '@mui/material/styles/ThemeProvider'
import Home from '../pages/home/Home'
import { theme } from '../theme/Theme'

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>
  )
}

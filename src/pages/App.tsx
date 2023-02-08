import ThemeProvider from '@mui/material/styles/ThemeProvider'
import Article from '../components/Article/Article'
import { theme } from '../theme/Theme'

export const App = () => {
  return <ThemeProvider theme={theme}>
    <Article/>
  </ThemeProvider>
}

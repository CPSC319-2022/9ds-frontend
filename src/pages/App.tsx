import { Typography } from '@mui/material'
import { Route, Router, Routes } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { Header } from '../components/Header'
import { Home } from './home'
import { Login } from './login'

export const App = () => {
  return (
    <BrowserRouter>
    <Header />
      <Typography>App Page</Typography>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/about' element={<Home/>}></Route>{/* TODO: change once an about us page exists*/}
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={<Login/>}></Route>{/* TODO: change once sign up page exists*/}
        </Routes>
      
    </BrowserRouter>
  )
}

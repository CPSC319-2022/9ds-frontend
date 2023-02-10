import ThemeProvider from '@mui/material/styles/ThemeProvider'
import Home from '../pages/home/Home'
import React from 'react'
import { theme } from '../theme/Theme'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import { CreateArticle } from './createarticle/CreateArticle'

export const App = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/create' element={<CreateArticle />} />
          {/* 
        Left here as template for next addition of routes
        <Route path="/sign-in" element={<Signin />}>
              <Route
                index
                element={
            
                    <Login /> <SigninPartners />
               
                }
          /> 
          */}
        </Routes>
      </ThemeProvider>
    </Router>
  )
}

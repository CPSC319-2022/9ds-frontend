import React from 'react'
import { CreateArticle } from '../../pages/createarticle/CreateArticle'
import { Home } from '../../pages/home'
import { EmailVerification } from '../../pages/forgotpassword/EmailVerification'
import { ConfirmPassword } from '../../pages/forgotpassword/ConfirmPasswordReset'
import Login from '../../pages/login/Login'

export interface RouteConfig {
  path: string
  component: JSX.Element
  isProtected?: boolean
}

export const ROUTE_CONFIG: { [name: string]: RouteConfig } = {
  home: {
    path: '/',
    component: <Home />,
  },
  create: {
    path: '/create',
    component: <CreateArticle />,
    isProtected: false,
  },
  login: {
    path: '/login',
    component: <Login />,
  },
  resendEmail: {
    path: '/reset/email',
    component: <EmailVerification/>,
  },
  resetPassword: {
    path: '/reset/password',
    component: <ConfirmPassword/>,
  },
}

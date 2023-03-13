import React from 'react'
import { CreateArticle } from '../../pages/createarticle/CreateArticle'
import { Home } from '../../pages/home'
import { EmailVerification } from '../../pages/sendemail/EmailVerification'
import { ConfirmPassword } from '../../pages/confirmpassword/ConfirmPasswordReset'
import { Login } from '../../pages/login/Login'
import { AboutUs } from '../../pages/aboutUs/AboutUs'
import { Profile } from '../../pages/profile/Profile'
import { UpdateArticle } from '../../pages/updatearticle'
import { IndividualBlogPost } from '../../pages/individualblogpost'

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
  aboutUs: {
      path: '/about-us',
      component: <AboutUs />,
  },
  resendEmail: {
    path: '/reset/email',
    component: <EmailVerification />,
  },
  resetPassword: {
    path: '/reset/password',
    component: <ConfirmPassword />,
  },
  profile: {
    path: '/profile',
    component: <Profile />,
  },
  edit: {
    path: '/update/:articleId',
    component: <UpdateArticle />,
    isProtected: false,
  },
  individualBlogPost: {
    path: '/blog/:articleId',
    component: <IndividualBlogPost />,
  },
}

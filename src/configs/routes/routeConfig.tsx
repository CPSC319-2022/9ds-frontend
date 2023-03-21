import React from 'react'
import { CreateArticle } from '../../pages/createarticle/CreateArticle'
import { Home } from '../../pages/home'
import { EmailVerification } from '../../pages/sendemail/EmailVerification'
import { ConfirmPassword } from '../../pages/confirmpassword/ConfirmPasswordReset'
import { Login } from '../../pages/login/Login'
import { AboutUs } from '../../pages/aboutUs/AboutUs'
import { Profile } from '../../pages/profile/Profile'
import { AdminDashboard } from '../../pages/admindashboard'
import { UpdateArticle } from '../../pages/updatearticle'
import { IndividualBlogPost } from '../../pages/individualblogpost'

export interface RouteConfig {
  path: string
  component: JSX.Element
  isProtected?: boolean
  allowedRoles?: string[]
  isProtectedOwnerUser?: boolean
}

export const ROUTE_CONFIG: { [name: string]: RouteConfig } = {
  home: {
    path: '/',
    component: <Home />,
  },
  create: {
    path: '/create',
    component: <CreateArticle />,
    isProtected: true,
    allowedRoles: ['contributor', 'admin'],
  },
  draft: {
    path: '/draft/:articleId',
    component: <UpdateArticle isDraft={true} />,
    isProtected: true,
    allowedRoles: ['contributor', 'admin'],
    isProtectedOwnerUser: true,
  },
  getStarted: {
    path: '/get-started',
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
    isProtected: true,
  },
  adminDashboard: {
    path: '/admin',
    component: <AdminDashboard />,
    isProtected: true,
    allowedRoles: ['admin'],
  },
  edit: {
    path: '/update/:articleId',
    component: <UpdateArticle />,
    isProtected: true,
    allowedRoles: ['contributor', 'admin'],
    isProtectedOwnerUser: true,
  },
  individualBlogPost: {
    path: '/blog/:articleId',
    component: <IndividualBlogPost />,
  },
}

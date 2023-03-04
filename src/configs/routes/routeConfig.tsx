import React from 'react'
import { CreateArticle } from '../../pages/createarticle/CreateArticle'
import { Home } from '../../pages/home'
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
    isProtected: true,
  },
  login: {
    path: '/login',
    component: <Login />,
  },
}

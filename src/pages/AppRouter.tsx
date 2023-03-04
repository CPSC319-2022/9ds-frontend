import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components'
import { RouteConfig, ROUTE_CONFIG } from '../configs'

export const AppRouter = () => {
  const buildRoutes = () => (
    <Routes>
      {Object.values(ROUTE_CONFIG).map(
        ({ path, component, isProtected }: RouteConfig) => {
          const element = isProtected ? (
            <ProtectedRoute>{component}</ProtectedRoute>
          ) : (
            component
          )
          return <Route key={path} path={path} element={element} />
        },
      )}
    </Routes>
  )

  return <Router>{buildRoutes()}</Router>
}

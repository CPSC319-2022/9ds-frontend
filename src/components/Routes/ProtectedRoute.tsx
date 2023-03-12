import React from 'react'
import { useEffect, FC, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTE_CONFIG } from '../../configs'
import { useAuth } from '../../hooks/firebase/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      return navigate(ROUTE_CONFIG.login.path)
    }
  }, [user])

  return <>{user ? children : null}</>
}

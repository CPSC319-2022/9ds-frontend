import React, { useContext } from 'react'
import { useEffect, FC, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { NotificationContext } from '../../context'
import { useAuth } from '../../hooks/firebase/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { dispatch } = useContext(NotificationContext)

  useEffect(() => {
    if (!user) {
      dispatch({
        notificationActionType: 'error',
        message: 'Please login to access this page',
      })
      return navigate('/get-started')
    }
  }, [user])

  return <>{user ? children : null}</>
}

import React, { useContext } from 'react'
import { useEffect, FC, ReactNode } from 'react'
import { NotificationContext } from '../../context/NotificationContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useArticleRead } from '../../hooks/firebase/useArticle'
import { useAuth } from '../../hooks/firebase/useAuth'
import { useUser } from '../../hooks/firebase/useUser'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
  isProtectedOwnerUser?: boolean
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  isProtectedOwnerUser,
}) => {
  const navigate = useNavigate()
  const { articleId } = useParams()
  const { article, loading, error } = useArticleRead(articleId || '0')

  const { user, initializing: userInitializing } = useAuth()
  const { queriedUser, loading: queriedUserLoading } = useUser()
  const { dispatch } = useContext(NotificationContext)

  useEffect(() => {
    if (!userInitializing) {
      if (!user) {
        dispatch({
          notificationActionType: 'error',
          message: 'Please login to access this page',
        })
        return navigate('/get-started')
      }

      if (
        allowedRoles &&
        !queriedUserLoading &&
        !allowedRoles.includes(queriedUser.role)
      ) {
        dispatch({
          notificationActionType: 'error',
          message: 'No authorization to access this page',
        })
        return navigate('/')
      }

      if (
        isProtectedOwnerUser &&
        !queriedUserLoading &&
        article &&
        article?.author_uid !== queriedUser.uid
      ) {
        dispatch({
          notificationActionType: 'error',
          message: 'Invalid user',
        })
        return navigate('/')
      }
    }
  }, [user, userInitializing, article, queriedUser, queriedUserLoading])

  const hideContent = userInitializing || queriedUserLoading

  return <>{hideContent ? null : children}</>
}

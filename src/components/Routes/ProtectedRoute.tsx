import React, { useContext } from 'react'
import { useEffect, FC, ReactNode } from 'react'
import { NotificationContext } from '../../context/NotificationContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useArticleRead } from '../../hooks/firebase/useArticle'
import { useAuth } from '../../hooks/firebase/useAuth'
import { useUser } from '../../hooks/firebase/useUser'

interface ProtectedRouteProps {
  children: ReactNode
  isProtectedAdmin?: boolean
  isProtectedOwnerUser?: boolean
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  isProtectedAdmin,
  isProtectedOwnerUser,
}) => {
  const navigate = useNavigate()
  const { articleId } = useParams()
  const article = articleId ? useArticleRead(articleId)?.article : undefined

  const { user, initializing } = useAuth()
  const { queriedUser, loading: queriedUserLoading } = useUser()
  const { dispatch } = useContext(NotificationContext)

  useEffect(() => {
    if (!initializing) {
      if (!user) {
        dispatch({
          notificationActionType: 'error',
          message: 'Please login to access this page',
        })
        return navigate('/get-started')
      }

      if (
        isProtectedAdmin &&
        !queriedUserLoading &&
        queriedUser.role !== 'admin'
      ) {
        dispatch({
          notificationActionType: 'error',
          message: 'Requires admin access',
        })
        return navigate('/')
      }

      if (
        isProtectedOwnerUser &&
        !queriedUserLoading &&
        article &&
        article.author_uid !== queriedUser.uid
      ) {
        dispatch({
          notificationActionType: 'error',
          message: 'Invalid user',
        })
        return navigate('/')
      }
    }
  }, [user, initializing, article, queriedUser, queriedUserLoading])

  const hideContent =
    !user || ((isProtectedAdmin || isProtectedOwnerUser) && queriedUserLoading)

  return <>{hideContent ? null : children}</>
}

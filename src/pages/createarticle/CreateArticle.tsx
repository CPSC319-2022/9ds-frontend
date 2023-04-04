import { useContext, useEffect, useState } from 'react'
import { AppWrapper } from '../../components/AppWrapper'
import { ArticleForm, ArticleFormPurpose } from '../../components/ArticleForm'
import { handleLoading } from '../../components/Spinner/Spinner'
import { useArticleCreate } from '../../hooks/firebase/useArticle'
import { useNavigate } from 'react-router-dom'
import { NotificationContext } from 'context/NotificationContext'

/* eslint-disable @typescript-eslint/no-unused-vars */

export const CreateArticle = () => {
  const navigate = useNavigate()
  const { dispatch } = useContext(NotificationContext)
  const {
    createArticle,
    error: errorArticleCreate,
    loading: loadingArticleCreate,
    articleId,
    setLoading,
  } = useArticleCreate()
  const [creating, setCreating] = useState(false)
  const component = (
    <ArticleForm
      purpose={ArticleFormPurpose.CREATE}
      setLoading={setLoading}
      onSubmit={(
        title: string,
        body: string,
        imagelink: string,
        published: boolean,
        articleId?: string,
      ) => {
        setCreating(true)
        createArticle(title, body, imagelink, published)
      }}
    />
  )

  useEffect(() => {
    if (creating && !loadingArticleCreate) {
      if (errorArticleCreate) {
        dispatch({
          notificationActionType: 'error',
          message: `Error creating article, please try again`,
        })
      } else {
        dispatch({
          notificationActionType: 'success',
          message: `Article created successfully!`,
        })
      }
      navigate('/profile')
    }
  }, [errorArticleCreate, loadingArticleCreate, creating])

  return (
    <AppWrapper>{handleLoading(loadingArticleCreate, component)}</AppWrapper>
  )
}

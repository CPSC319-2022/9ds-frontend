import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppWrapper } from '../../components/AppWrapper'
import { ArticleForm, ArticleFormPurpose } from '../../components/ArticleForm'
import { handleLoading } from '../../components/Spinner/Spinner'
import { useArticleEdit, useArticleRead } from '../../hooks/firebase/useArticle'
import { NotificationContext } from 'context/NotificationContext'

/* eslint-disable @typescript-eslint/no-unused-vars */

interface UpdateArticleProps {
  isDraft?: boolean
}

export const UpdateArticle = ({ isDraft = false }: UpdateArticleProps) => {
  const { articleId } = useParams()
  const { dispatch } = useContext(NotificationContext)
  const navigate = useNavigate()
  const {
    editArticle,
    error: errorArticleUpdate,
    loading: loadingArticleEdit,
    setLoading,
  } = useArticleEdit()
  const {
    error: errorArticleRead,
    loading: loadingArticleRead,
    article,
  } = useArticleRead(articleId || '')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (errorArticleRead) {
      dispatch({
        notificationActionType: 'error',
        message: `Article does not exist.`,
      })
      navigate('/profile')
    }
  }, [errorArticleRead])

  useEffect(() => {
    if (updating && !loadingArticleEdit) {
      if (errorArticleUpdate) {
        dispatch({
          notificationActionType: 'error',
          message: `Error updating article, please try again.`,
        })
      } else {
        dispatch({
          notificationActionType: 'success',
          message: `Article updated successfully!`,
        })
      }
      navigate('/profile')
    }
  }, [errorArticleUpdate, updating, loadingArticleEdit])

  const component = article && (
    <ArticleForm
      purpose={isDraft ? ArticleFormPurpose.DRAFT : ArticleFormPurpose.UPDATE}
      onSubmit={(
        title: string,
        body: string,
        imagelink: string,
        published: boolean,
        articleId?: string,
      ) => {
        if (articleId) {
          setUpdating(true)
          editArticle(articleId, title, body, imagelink, published)
        } else {
          dispatch({
            notificationActionType: 'error',
            message: `Error updating article, please try again.`,
          })
          navigate('/profile')
        }
      }}
      article={article}
      articleId={articleId}
      setLoading={setLoading}
    />
  )

  return (
    <AppWrapper>
      {handleLoading(loadingArticleRead || loadingArticleEdit, component)}
    </AppWrapper>
  )
}

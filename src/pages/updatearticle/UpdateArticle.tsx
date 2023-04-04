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
  const navigate = useNavigate()
  const { editArticle } = useArticleEdit()
  const { dispatch } = useContext(NotificationContext)
  const [loading, setLoading] = useState(false)
  const {
    error: errorArticleRead,
    loading: loadingArticleRead,
    article,
  } = useArticleRead(articleId || '')

  useEffect(() => {
    if (errorArticleRead) {
      dispatch({
        notificationActionType: 'error',
        message: `Article does not exist.`,
      })
      navigate('/profile')
    }
  }, [errorArticleRead])

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
          setLoading(true)
          editArticle(articleId, title, body, imagelink, published)
            .then(() => {
              dispatch({
                notificationActionType: 'success',
                message: `Successfully updated!`,
              })
            })
            .catch((err) => {
              dispatch({
                notificationActionType: 'error',
                message: `Error editing. Please try again later!`,
              })
            })
            .finally(() => {
              setLoading(false)
              navigate('/profile')
            })
        } else {
          dispatch({
            notificationActionType: 'error',
            message: `Error editing. Please try again later!`,
          })
          navigate('/profile')
        }
      }}
      article={article}
      articleId={articleId}
    />
  )

  return (
    <AppWrapper>
      {handleLoading(loadingArticleRead || loading, component)}
    </AppWrapper>
  )
}

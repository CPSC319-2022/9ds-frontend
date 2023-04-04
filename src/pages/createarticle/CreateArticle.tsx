import { useContext, useState } from 'react'
import { AppWrapper } from '../../components/AppWrapper'
import { ArticleForm, ArticleFormPurpose } from '../../components/ArticleForm'
import { handleLoading } from '../../components/Spinner/Spinner'
import { useArticleCreate } from '../../hooks/firebase/useArticle'
import { useNavigate } from 'react-router-dom'
import { NotificationContext } from 'context/NotificationContext'

/* eslint-disable @typescript-eslint/no-unused-vars */

export const CreateArticle = () => {
  const { createArticle, articleId } = useArticleCreate()
  const navigate = useNavigate()
  const { dispatch } = useContext(NotificationContext)
  const [loading, setLoading] = useState(false)
  const component = (
    <ArticleForm
      purpose={ArticleFormPurpose.CREATE}
      onSubmit={(
        title: string,
        body: string,
        imagelink: string,
        published: boolean,
        articleId?: string,
      ) => {
        setLoading(true)
        createArticle(title, body, imagelink, published)
          .then(() => {
            dispatch({
              notificationActionType: 'success',
              message: `Success!`,
            })
          })
          .catch((err) => {
            dispatch({
              notificationActionType: 'error',
              message: `There was an error. Please try again.`,
            })
          })
          .finally(() => {
            setLoading(false)
            navigate('/profile')
          })
      }}
    />
  )
  return <AppWrapper>{handleLoading(loading, component)}</AppWrapper>
}

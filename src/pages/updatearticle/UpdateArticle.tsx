import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppWrapper } from '../../components/AppWrapper'
import { ArticleForm, ArticleFormPurpose } from '../../components/ArticleForm'
import { useArticleEdit, useArticleRead } from '../../hooks/firebase/useArticle'

/* eslint-disable @typescript-eslint/no-unused-vars */

export const UpdateArticle = () => {
  const { articleId } = useParams()
  const navigate = useNavigate()
  const { editArticle, error: errorArticleUpdate } = useArticleEdit()
  const {
    error: errorArticleRead,
    loading: loadingArticleRead,
    article,
  } = useArticleRead(articleId || '')

  useEffect(() => {
    if (errorArticleRead) {
      navigate('/profile')
      throw new Error('Article does not exist.')
    } else if (errorArticleUpdate) {
      navigate('/profile')
      throw new Error('Error updating article')
    }
  })
  return (
    <AppWrapper>
      {!loadingArticleRead && article && (
        <ArticleForm
          purpose={ArticleFormPurpose.UPDATE}
          onSubmit={(
            title: string,
            body: string,
            imagelink: string,
            published: boolean,
            articleId?: string,
          ) => {
            if (articleId !== undefined) {
              editArticle(articleId, title, body, imagelink, published)
            } else {
              throw Error('Error editing article. Please try again later!')
            }
          }}
          article={article}
          articleId={articleId}
        />
      )}
    </AppWrapper>
  )
}

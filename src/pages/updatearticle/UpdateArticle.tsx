import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppWrapper } from '../../components/AppWrapper'
import { ArticleForm, ArticleFormPurpose } from '../../components/ArticleForm'
import { handleLoading } from '../../components/Spinner/Spinner'
import { useArticleEdit, useArticleRead } from '../../hooks/firebase/useArticle'

/* eslint-disable @typescript-eslint/no-unused-vars */

interface UpdateArticleProps {
  isDraft?: boolean
}

export const UpdateArticle = ({ isDraft = false }: UpdateArticleProps) => {
  const { articleId } = useParams()
  const navigate = useNavigate()
  const {
    editArticle,
    error: errorArticleUpdate,
    loading: loadingArticleEdit,
  } = useArticleEdit()
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
          editArticle(articleId, title, body, imagelink, published)
        } else {
          throw Error('Error editing article. Please try again later!')
        }
      }}
      article={article}
      articleId={articleId}
    />
  )

  return (
    <AppWrapper>
      {handleLoading(loadingArticleRead || loadingArticleEdit, component)}
    </AppWrapper>
  )
}

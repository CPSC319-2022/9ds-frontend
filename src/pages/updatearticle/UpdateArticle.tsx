import { AppWrapper } from '../../components/AppWrapper'
import { ArticleForm, ArticleFormPurpose } from '../../components/ArticleForm'
import { useArticleEdit, useArticleRead } from '../../hooks/firebase/useArticle'

/* eslint-disable @typescript-eslint/no-unused-vars */

interface UpdateArticleProps {
  articleIdForUpdate: string
}

export const UpdateArticle = ({ articleIdForUpdate }: UpdateArticleProps) => {
  const {
    editArticle,
    error: errorArticleUpdate,
    loading: loadingArticleUpdate,
  } = useArticleEdit()
  const {
    error: errorArticleRead,
    loading: loadingArticleRead,
    article,
  } = useArticleRead(articleIdForUpdate)
  return (
    <AppWrapper>
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
            // TODO add error handling
          }
        }}
      />
    </AppWrapper>
  )
}

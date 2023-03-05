import { AppWrapper } from '../../components/AppWrapper'
import { ArticleForm, ArticleFormPurpose } from '../../components/ArticleForm'
import { useArticleCreate } from '../../hooks/firebase/useArticle'

export const CreateArticle = () => {
  const {
    createArticle,
    error: errorArticleCreate,
    loading: loadingArticleCreate,
    articleId,
  } = useArticleCreate()
  return (
    <AppWrapper>
      <ArticleForm
        purpose={ArticleFormPurpose.CREATE}
        onSubmit={(
          title: string,
          body: string,
          imagelink: string,
          published: boolean,
          articleId?: string,
        ) => {
          createArticle(title, body, imagelink, published)
        }}
      />
    </AppWrapper>
  )
}

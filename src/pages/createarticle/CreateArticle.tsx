import { AppWrapper } from '../../components/AppWrapper'
import { ArticleForm, ArticleFormPurpose } from '../../components/ArticleForm'
import { handleLoading } from '../../components/Spinner/Spinner'
import { useArticleCreate } from '../../hooks/firebase/useArticle'

/* eslint-disable @typescript-eslint/no-unused-vars */

export const CreateArticle = () => {
  const {
    createArticle,
    error: errorArticleCreate,
    loading: loadingArticleCreate,
    articleId,
    setLoading
  } = useArticleCreate()
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
      createArticle(title, body, imagelink, published)
    }}
  />
  )
  return (
    <AppWrapper>
      {handleLoading(loadingArticleCreate, component)}
    </AppWrapper>
  )
}

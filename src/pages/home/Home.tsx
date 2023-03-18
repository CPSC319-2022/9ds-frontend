import React, { FC, useContext, useEffect, useState } from 'react'
import { Article } from '../../components/Article'
import { AppWrapper } from '../../components/AppWrapper'
import { RecentPosts } from './RecentPosts'
import {
  ArticlePreview,
  useArticleRecents,
} from '../../hooks/firebase/useArticle'
import { UISkeleton } from '../../components/UISkeleton'
import { NotificationContext } from '../../context'
import { handleLoading } from '../../components/Spinner/Spinner'

export const Home: FC = () => {
  const { dispatch } = useContext(NotificationContext)
  const [featuredArticle, setFeaturedArticle] = useState<
    ArticlePreview | undefined
  >()
  const { articles, getNext, loading, loadingNext, endOfCollection, error } =
    useArticleRecents(5)

  useEffect(() => {
    if (error) {
      dispatch({
        notificationActionType: 'error',
        message: `Error fetching recent artices: ${error}`,
      })
    }
  }, [error])

  useEffect(() => {
    if (!featuredArticle && articles.length) {
      const randArticle = articles[Math.floor(Math.random() * articles.length)]
      setFeaturedArticle(randArticle)
    }
  }, [articles])

  const component = (
    <>
      {featuredArticle ? (
        <Article size='large' article={featuredArticle} />
      ) : (
        <UISkeleton elemWidth='100%' elemHeight='100%' />
      )}
      <RecentPosts
        articles={articles.filter(
          (article) => article.articleId !== featuredArticle?.articleId,
        )}
        getNext={getNext}
        loading={loading}
        loadingNext={loadingNext}
        endOfCollection={endOfCollection}
      />
    </>
  )

  return (<AppWrapper>
    {handleLoading(loading, component)}
  </AppWrapper>)
}

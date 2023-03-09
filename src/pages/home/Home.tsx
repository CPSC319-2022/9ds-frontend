import React, { FC, useEffect, useState } from 'react'
import { Article } from '../../components/Article'
import { AppWrapper } from '../../components/AppWrapper'
import { RecentPosts } from './RecentPosts'
import {
  ArticlePreview,
  useArticleRecents,
} from '../../hooks/firebase/useArticle'
import { UISkeleton } from '../../components/UISkeleton'

export const Home: FC = () => {
  const [featuredArticle, setFeaturedArticle] = useState<
    ArticlePreview | undefined
  >()
  const { articles, getNext, loading, loadingNext, endOfCollection, error } =
    useArticleRecents(5)

  useEffect(() => {
    // TODO: send error notification
    if (error) {
      console.log(error)
    }
  }, [error])

  useEffect(() => {
    if (!featuredArticle && articles.length) {
      const randArticle = articles[Math.floor(Math.random() * articles.length)]
      setFeaturedArticle(randArticle)
    }
  }, [articles])

  return (
    <AppWrapper>
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
    </AppWrapper>
  )
}

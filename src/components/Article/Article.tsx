import React, { FC } from 'react'
import { ArticlePreview } from '../../hooks/firebase/useArticle'
import { ArticleLarge } from './ArticleLarge'
import { ArticleSmall } from './ArticleSmall'

type ArticleProps = {
  size?: 'large' | 'small'
  article: ArticlePreview
}

export const Article: FC<ArticleProps> = ({ size, article }) => {
  if (size !== 'large') {
    return <ArticleSmall article={article} />
  } else {
    return <ArticleLarge article={article} />
  }
}

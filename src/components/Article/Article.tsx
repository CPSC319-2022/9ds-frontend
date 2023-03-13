import React, { FC } from 'react'
import { ArticlePreview } from '../../hooks/firebase/useArticle'
import { ArticleLarge } from './ArticleLarge'
import { ArticleSmall } from './ArticleSmall'

type ArticleProps = {
  size?: 'large' | 'small'
  article: ArticlePreview
  clickDisabled?: boolean
}

export const Article: FC<ArticleProps> = ({ size, article, clickDisabled }) => {
  if (size !== 'large') {
    return <ArticleSmall article={article} clickDisabled={clickDisabled} />
  } else {
    return <ArticleLarge article={article} clickDisabled={clickDisabled} />
  }
}

import React, { FC } from 'react'
import { ArticlePreview } from '../../hooks/firebase/useArticle'
import { ArticleLarge } from './ArticleLarge'
import { ArticleSmall } from './ArticleSmall'

type ArticleProps = {
  size?: 'large' | 'small'
  article: ArticlePreview
  notFeatured?: boolean
  clickDisabled?: boolean
  isDraft?: boolean
}

export const Article: FC<ArticleProps> = ({
  size,
  article,
  clickDisabled,
  notFeatured = false,
  isDraft = false,
}) => {
  if (size !== 'large') {
    return (
      <ArticleSmall
        article={article}
        clickDisabled={clickDisabled}
        isDraft={isDraft}
      />
    )
  } else {
    return (
      <ArticleLarge
        article={article}
        clickDisabled={clickDisabled}
        notFeatured={notFeatured}
      />
    )
  }
}

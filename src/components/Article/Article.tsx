import React, { FC } from 'react'
import {ArticleLarge} from './ArticleLarge'
import {ArticleSmall} from './ArticleSmall'

type ArticleProps = {
  size?: 'large' | 'small'
}

export const Article: FC<ArticleProps> = ({ size }) => {
  if (size !== 'large') {
    return <ArticleSmall />
  } else {
    return <ArticleLarge />
  }
}


import { Grid } from '@mui/material'
import { FC } from 'react'
import { ArticlePreview } from '../../hooks/firebase/useArticle'
import { Article } from '../Article'

export enum ItemGridType {
  ARTICLES,
  DRAFTS,
}

interface ItemGridProps {
  items: ArticlePreview[]
  type: ItemGridType
}

export const ItemGrid = ({ items, type }: ItemGridProps) => {
  return (
    <Grid container columns={16} rowSpacing={35} alignSelf='stretch'>
      {items.map((article) => (
        <Grid
          key={article.articleId}
          item
          xs={4}
          justifyContent='center'
          alignItems='center'
          style={{ display: 'flex' }}
        >
          <Article
            size='small'
            article={article}
            isDraft={type === ItemGridType.DRAFTS}
          />
        </Grid>
      ))}
    </Grid>
  )
}

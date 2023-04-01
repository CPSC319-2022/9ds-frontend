import { Grid } from '@mui/material'
import { ArticlePreview } from 'types/Article'
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
          data-testid='grid-item'
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

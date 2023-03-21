import { Grid } from '@mui/material'
import { ArticlePreview } from '../../hooks/firebase/useArticle'
import { Article } from '../Article'

interface ItemGridProps {
  items: ArticlePreview[]
}

export const ItemGrid = ({ items }: ItemGridProps) => {
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
          <Article size='small' article={article} />
        </Grid>
      ))}
    </Grid>
  )
}

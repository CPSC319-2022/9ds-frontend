import { Grid, Stack, Typography } from '@mui/material'
import React, { FC } from 'react'
import { Article } from '../../components/Article'
import { Button } from '../../components/Button'
import { ItemGrid, ItemGridType } from '../../components/ItemGrid'
import { UISkeleton } from '../../components/UISkeleton'
import { ArticlePreview } from '../../hooks/firebase/useArticle'

interface RecentPostsProps {
  articles: ArticlePreview[]
  getNext: (n: number) => void
  loading: boolean
  loadingNext: boolean
  endOfCollection: boolean
}

export const RecentPosts: FC<RecentPostsProps> = ({
  articles,
  getNext,
  loading,
  loadingNext,
  endOfCollection,
}) => {
  if (loading) {
    return <UISkeleton elemWidth='300px' elemHeight='400px' elems={4} />
  }

  return (
    <Stack direction='column' spacing={32} width='100%' alignItems='center'>
      <Typography
        variant='h4'
        color='black.main'
        sx={{ alignSelf: 'flex-start' }}
      >
        <div id='recentPosts'>Recent posts</div>
      </Typography>
      <ItemGrid items={articles} type={ItemGridType.ARTICLES} />
      {loadingNext && (
        <UISkeleton
          elemWidth='300px'
          elemHeight='400px'
          sx={{
            justifyContent: 'center',
            maxWidth: '80%',
          }}
          elems={4}
        />
      )}
      {!endOfCollection && (
        <Button
          onClick={() => getNext(4)}
          disabled={loadingNext}
          dark
          text='Load more...'
          size='large'
        />
      )}
    </Stack>
  )
}

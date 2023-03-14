import { Grid, Skeleton, SxProps, Theme } from '@mui/material'
import { FC } from 'react'

interface UISkeletonProps {
  elemWidth: string
  elemHeight: string
  elems?: number
  sx?: SxProps<Theme>
}

export const UISkeleton: FC<UISkeletonProps> = ({
  elemWidth,
  elemHeight,
  elems = 1,
  sx,
}) => {
  return (
    <Grid spacing={32} container sx={sx}>
      {Array(elems)
        .fill(undefined)
        .map((_, index) => (
          <Grid key={index} item>
            <Skeleton
              variant='rectangular'
              width={elemWidth}
              height={elemHeight}
              sx={{ borderRadius: '12px' }}
            />
          </Grid>
        ))}
    </Grid>
  )
}

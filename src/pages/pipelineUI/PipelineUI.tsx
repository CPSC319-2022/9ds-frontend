import React, { FC } from 'react'
import { AppWrapper } from '../../components/AppWrapper'
import { Typography, Stack, Divider } from '@mui/material'
import { AboutUsCard } from '../../components/AboutUsCard'
import { CheckCircleOutline, Cancel } from '@mui/icons-material'
import { BuildStep } from 'components/BuildStep'

export const PipelineUI: FC = () => {
  return (
    <Stack>
      <Stack
        direction='column'
        alignItems='center'
        border='4px solid black'
        width='100%'
        height='100%'
      >
        <Typography variant='h2'>Build UI</Typography>
      </Stack>
      <Stack>
        <Typography variant='h2'>Dev</Typography>
        <div>
          <Divider position='relative' sx={{ x: '0', y: '0' }} />
          <Stack direction='row' justifyContent='space-evenly'>
            <BuildStep type='check' />
            <BuildStep type='check' />
            <BuildStep type='check' />
            <BuildStep type='check' />
            <BuildStep type='cancel' />
          </Stack>
        </div>
      </Stack>
    </Stack>
  )
}

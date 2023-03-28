import React, { FC } from 'react'
import { AppWrapper } from '../../components/AppWrapper'
import { Typography, Stack, Divider } from '@mui/material'
import { AboutUsCard } from '../../components/AboutUsCard'
import { CheckCircleOutline, Cancel } from '@mui/icons-material'
import { BuildStep } from 'components/BuildStep'

export const PipelineUI: FC = () => {
  return (
    <AppWrapper>
      <Stack
        direction='column'
        alignItems='center'
        spacing={60}
        border='4px solid black'
        width='100%'
      >
        <Typography variant='h2'>Build UI</Typography>
      </Stack>
      <Stack>
        <Typography variant='h2'>Dev</Typography>
        <Stack>
          <Divider />
          <Stack justifyContent='space-evenly'>
            <BuildStep type='cancel' />
            <BuildStep type='cancel' />
            <BuildStep type='cancel' />
            <BuildStep type='cancel' />
            <BuildStep type='cancel' />
          </Stack>
        </Stack>
      </Stack>
    </AppWrapper>
  )
}

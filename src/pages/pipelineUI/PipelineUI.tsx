import React, { FC } from 'react'
import { AppWrapper } from '../../components/AppWrapper'
import { Typography, Stack, Divider } from '@mui/material'
import { AboutUsCard } from '../../components/AboutUsCard'
import { CheckCircleOutline, Cancel } from '@mui/icons-material'
import { BuildStep } from 'components/BuildStep'

export const PipelineUI: FC = () => {
  const arr: number[] = [1, 2, 3, 4, 5, 6]
  const currStep = 4
  return (
    <Stack spacing={48} p='32px'>
      <Stack
        direction='column'
        alignItems='center'
        border='4px solid black'
        width='200px'
        borderRadius='12px'
      >
        <Typography variant='h3'>Build UI</Typography>
      </Stack>
      <Stack direction='row' spacing={24} width='100%'>
        <Typography variant='h2'>Dev</Typography>

        <Stack direction='row' justifyContent='space-evenly' width='100%'>
          {arr.map((num) => {
            if (currStep > num) {
              <BuildStep step={num} type='check' />
            } else {
              
            }
          })}
          <BuildStep step={1} type='check' />
          <BuildStep step={2} type='check' />
          <BuildStep step={3} type='check' />
          <BuildStep step={4} type='cancel' />
          <BuildStep step={5} type='cancel' />
          <BuildStep step={6} type='cancel' />
        </Stack>
      </Stack>
    </Stack>
  )
}

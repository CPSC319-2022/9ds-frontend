import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import feather from '../../assets/feather.png'
import logo from '../../assets/logo.png'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../Button/Button'
import { CheckCircleOutline, Cancel } from '@mui/icons-material'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'

type BuildStepProps = {
  type: 'cancel' | 'check' | 'working'
  step: number
}

const getStepName = (step: number) => {
  let stepName
  switch (step) {
    case 1:
      stepName = 'Install Dependencies'
      break
    case 2:
      stepName = 'Lint'
      break
    case 3:
      stepName = 'Unit Tests'
      break
    case 4:
      stepName = 'Dockerize'
      break
    case 5:
      stepName = 'Send to GCR'
      break
    case 6:
      stepName = 'Deploy'
      break
    default:
      stepName = 'Install Dependencies'
      break
  }
  return stepName
}

export const BuildStep: FC<BuildStepProps> = ({ type, step }) => {
  return (
    <Stack
      direction='column'
      justifyContent='center'
      alignItems='center'
      border='2px solid black'
      borderRadius='12px'
      spacing={8}
      boxSizing='border-box'
      p='4px'
      minWidth='120px'
    >
      <Typography variant='h5'>Step {step}</Typography>
      <Typography data-testid="step-heading" variant='subheading'>{getStepName(step)}</Typography>
      {type === 'cancel' ? (
        <Cancel color='error' />
      ) : type === 'check' ? (
        <CheckCircleOutline color='success' />
      ) : (
        <RemoveCircleIcon color='info' />
      )}
    </Stack>
  )
}

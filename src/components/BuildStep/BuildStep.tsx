import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { FC } from 'react'
import { CheckCircleOutline, Cancel } from '@mui/icons-material'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'

type BuildStepProps = {
  type: 'cancel' | 'check' | 'working'
  step: number
}

const getStepName = (step: number) => {
  let stepName
  switch (step) {
    case 0:
      stepName = 'Install Dependencies'
      break
    case 1:
      stepName = 'Lint'
      break
    case 2:
      stepName = 'Unit Tests'
      break
    case 3:
      stepName = 'Dockerize'
      break
    case 4:
      stepName = 'Send to GCR'
      break
    case 5:
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

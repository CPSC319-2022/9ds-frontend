import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import feather from '../../assets/feather.png'
import logo from '../../assets/logo.png'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../Button/Button'
import { CheckCircleOutline, Cancel } from '@mui/icons-material'

type BuildStepProps = {
  type: 'cancel' | 'check'
}
export const BuildStep: FC<BuildStepProps> = ({ type }) => {
  return type === 'cancel' ? <Cancel /> : <CheckCircleOutline />
}

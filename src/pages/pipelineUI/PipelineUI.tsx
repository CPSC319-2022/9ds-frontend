import React, { FC, useEffect, useState } from 'react'
import { AppWrapper } from '../../components/AppWrapper'
import { Typography, Stack, Divider, IconButton } from '@mui/material'
import { AboutUsCard } from '../../components/AboutUsCard'
import { BuildStep } from 'components/BuildStep'
import { CheckCircleOutline, Cancel } from '@mui/icons-material'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import axios from 'axios'
import RefreshIcon from '@mui/icons-material/Refresh'

const DEV_URL: any = process.env.REACT_APP_DEV_CF_URL
const QA_URL: any = process.env.REACT_APP_QA_CF_URL
const PROD_URL: any = process.env.REACT_APP_PROD_CF_URL

export const PipelineUI: FC = () => {
  const arr: number[] = [0, 1, 2, 3, 4, 5]

  const res: any = []

  const [buildStatus, setBuildStatus] = useState(null)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    let requestURL: any = ''

    if (process.env.REACT_APP_ENV === 'DEV') {
      requestURL = DEV_URL
    } else if (process.env.REACT_APP_ENV === 'PROD') {
      requestURL = PROD_URL
    } else {
      requestURL = QA_URL
    }
    axios
      .get(DEV_URL, { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        setBuildStatus(response.data)
        console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [refresh])

  arr.map((num) => {
    if (buildStatus && buildStatus['current_step'] > num) {
      res.push(<BuildStep key={num + 100} step={num} type='check' />)
    } else if (buildStatus && buildStatus['status'] === 'WORKING') {
      res.push(<BuildStep key={num + 100} step={num} type='working' />)
    } else if (buildStatus && buildStatus['status'] === 'DONE') {
      res.push(<BuildStep key={num + 100} step={num} type='check' />)
    } else {
      res.push(<BuildStep key={num + 100} step={num} type='cancel' />)
    }
  })
  return (
    <Stack spacing={48} p='32px'>
      <Stack
        direction='column'
        alignItems='center'
        border='4px solid black'
        width='280px'
        borderRadius='12px'
      >
        <Typography variant='h3'>Pipeline UI</Typography>
      </Stack>

      <Stack
        spacing={16}
        width='fit-content'
        border='1px solid black'
        borderRadius='12px'
        p='12px'
        boxSizing='border-box'
      >
        <Typography variant='h5'>Guide</Typography>

        <Stack direction='row' alignItems='center'>
          <CheckCircleOutline color='success' />
          <Typography variant='caption'>- Step Succeeded</Typography>
        </Stack>

        <Stack direction='row' alignItems='center'>
          <RemoveCircleIcon color='info' />
          <Typography variant='caption'>- Step Pending</Typography>
        </Stack>

        <Stack direction='row' alignItems='center'>
          <Cancel color='error' />
          <Typography variant='caption'>- Step Failed</Typography>
        </Stack>
      </Stack>

      <Stack direction='row' spacing={24} width='100%'>
        <Typography variant='h2'>{process.env.REACT_APP_ENV}</Typography>

        <Stack
          direction='row'
          justifyContent='space-evenly'
          width='100%'
          alignItems='center'
        >
          {res}
        </Stack>
        <IconButton onClick={() => setRefresh((prev) => !prev)}>
          <RefreshIcon sx={{ width: '75px', height: '75px' }} />
        </IconButton>
      </Stack>
    </Stack>
  )
}

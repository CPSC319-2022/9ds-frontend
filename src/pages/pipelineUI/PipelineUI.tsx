import React, { FC, useEffect, useState } from 'react'
import { AppWrapper } from '../../components/AppWrapper'
import { Typography, Stack, Divider } from '@mui/material'
import { AboutUsCard } from '../../components/AboutUsCard'
import { CheckCircleOutline, Cancel } from '@mui/icons-material'
import { BuildStep } from 'components/BuildStep'
import axios from 'axios'

const DEV_URL: any = process.env.REACT_APP_DEV_CF_URL
const QA_URL: any = process.env.REACT_APP_QA_CF_URL
const PROD_URL: any = process.env.REACT_APP_PROD_CF_URL

export const PipelineUI: FC = () => {
  const arr: number[] = [0, 1, 2, 3, 4, 5]
  const currStep = 4
  const currStatus = 'WORKING'
  const res: any = []

  const [buildStatus, setBuildStatus] = useState(null)

  useEffect(() => {
    // let requestURL: any = ''
    console.log('ENV IS', process.env.REACT_APP_ENV)
    // if (process.env.REACT_APP_ENV === 'DEV') {
    //   requestURL = process.env.REACT_APP_DEV_CF_URL
    // } else if (process.env.REACT_APP_ENV === 'QA') {
    //   requestURL = process.env.REACT_APP_QA_CF_URL
    // } else {
    //   requestURL = process.env.REACT_APP_PROD_CF_URL
    // }
    // console.log('req url is', requestURL)
    axios
      .get(DEV_URL, { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        setBuildStatus(response.data)
        console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  arr.map((num) => {
    if (buildStatus && buildStatus['current_step'] > num) {
      res.push(<BuildStep key={num + 100} step={num} type='check' />)
    } else if (
      buildStatus &&
      buildStatus['current_step'] === num &&
      buildStatus['status'] === 'WORKING'
    ) {
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
        width='200px'
        borderRadius='12px'
      >
        <Typography variant='h3'>Build UI</Typography>
      </Stack>
      <Stack direction='row' spacing={24} width='100%'>
        <Typography variant='h2'>{process.env.REACT_APP_ENV}</Typography>

        <Stack direction='row' justifyContent='space-evenly' width='100%'>
          {res}
        </Stack>
      </Stack>
    </Stack>
  )
}

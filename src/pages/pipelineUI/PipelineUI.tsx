import { FC, useEffect, useState } from 'react'
import { Typography, Stack, IconButton, FormHelperText } from '@mui/material'
import { BuildStep } from 'components/BuildStep'
import { CheckCircleOutline, Cancel } from '@mui/icons-material'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import axios from 'axios'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'


const DEV_URL: any = process.env.REACT_APP_DEV_CF_URL
const QA_URL: any = process.env.REACT_APP_QA_CF_URL
const PROD_URL: any = process.env.REACT_APP_PROD_CF_URL

// The following is the definition of bad code - Luke
export const PipelineUI: FC = () => {
  const arr: number[] = [0, 1, 2, 3, 4, 5]

  const dev_res: any = []
  const qa_res: any = []
  const prod_res: any = []

  const [devBuildStatus, setDevBuildStatus] = useState(null)
  const [qaBuildStatus, setQABuildStatus] = useState(null)
  const [prodBuildStatus, setProdBuildStatus] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const [QAError, setQAError] = useState('')
  const [prodError, setProdError] = useState('')
  const [devError, setDevError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    setQAError("")
    setDevError("")
    setProdError("")
    axios
      .get(DEV_URL, { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        setDevBuildStatus(response.data)
      })
      .catch(() => {
        setDevError("Pending to fetch progress for Dev, refresh")
      })

    axios
      .get(QA_URL, { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        setQABuildStatus(response.data)
      })
      .catch(() => {
        setQAError("Pending to fetch progress for QA, refresh")
      })

    axios
      .get(PROD_URL, { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        setProdBuildStatus(response.data)
      })
      .catch(() => {
        setProdError("Pending to fetch progress for Prod, refresh")
      })

  }, [refresh])

  arr.map((num) => {
    if (devBuildStatus && devBuildStatus['status'] === 'DNE') {
      dev_res.push(<BuildStep key={num + 101} step={num} type='working' />) // Should have a pending status, :salute:
    } else if (devBuildStatus && devBuildStatus['status'] === 'DONE') {
      dev_res.push(<BuildStep key={num + 101} step={num} type='check' />)
    } else if (devBuildStatus && devBuildStatus['current_step'] > num) {
      dev_res.push(<BuildStep key={num + 101} step={num} type='check' />) // I don't know why 100 -> 101 works, but I take it
    } else if (devBuildStatus && devBuildStatus['status'] === 'ERROR') {
      dev_res.push(<BuildStep key={num + 101} step={num} type='cancel' />)
    } else {
      dev_res.push(<BuildStep key={num + 101} step={num} type='working' />)
    }
  })

  arr.map((num) => {
    if (qaBuildStatus && qaBuildStatus['status'] === 'DNE') {
      qa_res.push(<BuildStep key={num + 101} step={num} type='working' />) // Should have a pending status, :salute:
    } else if (qaBuildStatus && qaBuildStatus['status'] === 'DONE') {
      qa_res.push(<BuildStep key={num + 101} step={num} type='check' />)
    } else if (qaBuildStatus && qaBuildStatus['current_step'] > num) {
      qa_res.push(<BuildStep key={num + 101} step={num} type='check' />) // I don't know why 100 -> 101 works, but I take it
    } else if (qaBuildStatus && qaBuildStatus['status'] === 'ERROR') {
      qa_res.push(<BuildStep key={num + 101} step={num} type='cancel' />)
    } else {
      qa_res.push(<BuildStep key={num + 101} step={num} type='working' />)
    }
  })

  arr.map((num) => {
    if (prodBuildStatus && prodBuildStatus['status'] === 'DNE') {
      prod_res.push(<BuildStep key={num + 101} step={num} type='working' />) // Should have a pending status, :salute:
    } else if (prodBuildStatus && prodBuildStatus['status'] === 'DONE') {
      prod_res.push(<BuildStep key={num + 101} step={num} type='check' />)
    } else if (prodBuildStatus && prodBuildStatus['current_step'] > num) {
      prod_res.push(<BuildStep key={num + 101} step={num} type='check' />) // I don't know why 100 -> 101 works, but I take it
    } else if (prodBuildStatus && prodBuildStatus['status'] === 'ERROR') {
      prod_res.push(<BuildStep key={num + 101} step={num} type='cancel' />)
    } else {
      prod_res.push(<BuildStep key={num + 101} step={num} type='working' />)
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
        <Typography variant='h2'>{"Dev"}</Typography>

        <Stack
          direction='row'
          justifyContent='space-evenly'
          width='100%'
          alignItems='center'
        >
          {dev_res}
        </Stack>
        <Stack sx={{justifyContent: 'center', alignItems: 'center'}}>
        <IconButton onClick={() => setRefresh((prev) => !prev)}>
          <RefreshIcon sx={{ width: '75px', height: '75px' }} />
        </IconButton>
        {devError.length > 0 && (
            <FormHelperText data-testid="error-msg">
              {devError}
            </FormHelperText>
          )}
        </Stack>
      </Stack>

      <Stack direction='row' spacing={24} width='100%'>
        <Typography variant='h2'>{"QA"}</Typography>

        <Stack
          direction='row'
          justifyContent='space-evenly'
          width='100%'
          alignItems='center'
        >
          {qa_res}
        </Stack>
        <Stack sx={{justifyContent: 'center', alignItems: 'center'}}>
        <IconButton onClick={() => setRefresh((prev) => !prev)}>
          <RefreshIcon sx={{ width: '75px', height: '75px' }} />
        </IconButton>
        {QAError.length > 0 && (
            <FormHelperText data-testid="error-msg">
              {QAError}
            </FormHelperText>
          )}
        </Stack>
      </Stack>

      <Stack direction='row' spacing={24} width='100%'>
        <Typography variant='h2'>{"Prod"}</Typography>

        <Stack
          direction='row'
          justifyContent='space-evenly'
          width='100%'
          alignItems='center'
        >
          {prod_res}
        </Stack>
        <Stack sx={{justifyContent: 'center', alignItems: 'center'}}>
        <IconButton onClick={() => setRefresh((prev) => !prev)}>
          <RefreshIcon sx={{ width: '75px', height: '75px' }} />
        </IconButton>
        {prodError.length > 0 && (
            <FormHelperText data-testid="error-msg">
              {prodError}
            </FormHelperText>
          )}
        </Stack>
      </Stack>
      <Button style={{width: '100px'}} text="HOME" onClick={() => navigate("/")}/>
    </Stack>
  )
}

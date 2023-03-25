import {
  Typography,
  Stack,
  Button as MUIButton,
} from '@mui/material'
import React, { FC } from 'react'
import { Button } from '../Button'

interface FileUploadProps {
    setFile: Function
    file: File | null
}

export const FileUploader: FC<FileUploadProps> = ({setFile, file}) => {

  return (
    <Stack
      direction={'row'}
      spacing={2}
      width={'300px'}
      sx={{ justifyContent: 'space-evenly', alignItems: 'center' }}
    >
      <Button dark text='RESET' onClick={() => setFile(null)} />
      <MUIButton
        size={'small'}
        component='label'
        variant='contained'
        sx={{ backgroundColor: 'white.main', border: '2px solid black' }}
      >
        <Typography variant='button' sx={{ color: 'black.main' }}>
          UPLOAD
        </Typography>
        <input
          type='file'
          hidden
          accept='image/*'
          multiple
          onClick={(event) => {
            const e = event.target as HTMLInputElement
            e.value = ''
          }}
          onChange={(event) =>
            setFile(event.target?.files ? event.target.files[0] : file)
          }
        />
      </MUIButton>
      {file != null ? (
        <Typography paddingLeft={'20px'}>File Selected</Typography>
      ) : (
        <Typography>File Unselected</Typography>
      )}
    </Stack>
  )
}

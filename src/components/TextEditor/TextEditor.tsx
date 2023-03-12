import Stack from '@mui/material/Stack'
import { Typography, Box, FormHelperText } from '@mui/material'
import { convertToRaw, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'
import bold from '../../assets/bold.svg'
import italic from '../../assets/italic.svg'
import underline from '../../assets/underline.svg'
import { Editor } from 'react-draft-wysiwyg'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import React, { FC, useState } from 'react'
import { Button } from '../Button/Button'

export interface TextEditorInfo {
  editorState: EditorState
  setEditorState: (editorState: EditorState) => void
}
interface TextEditorProps {
  editorInfo?: TextEditorInfo
  error?: boolean
  errorMsg?: string
}

export const TextEditor: FC<TextEditorProps> = ({
  editorInfo,
  error,
  errorMsg,
}) => {
  const [editState, setEditState] =
    editorInfo === undefined
      ? useState(() => EditorState.createEmpty())
      : [editorInfo.editorState, editorInfo.setEditorState]

  const toolbarConfig = {
    options: ['inline'],
    inline: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ['bold', 'italic', 'underline'],
      bold: { icon: bold, className: undefined },
      italic: { icon: italic, className: undefined },
      underline: { icon: underline, className: undefined },
    },
  }
  return (
    <Box width={'100%'}>
      <Stack direction='row' justifyContent={'space-between'} width={'100%'}>
        <Typography variant='title' sx={{ color: 'black.main' }}>
          Body
        </Typography>
        <Box
          borderRadius='4px'
          width={'88%'}
          height={'182px'}
          sx={{
            padding: '16.5px 14px',
            wordBreak: 'break-all',
            overflowY: 'scroll',
            border: 1,
            borderColor: error ? 'error.main' : 'grey.500',
          }}
        >
          <Editor
            editorStyle={{ font: 'Roboto', maxLines: 7 }}
            toolbar={toolbarConfig}
            editorState={editState}
            onEditorStateChange={setEditState}
          />
        </Box>
      </Stack>
      {error && <FormHelperText sx={{pl: "85px"}} error={true}>{errorMsg}</FormHelperText>}
    </Box>
  )
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import Stack from '@mui/material/Stack'
import { Typography, Box, FormHelperText } from '@mui/material'
import { convertFromRaw, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'
import bold from '../../assets/bold.svg'
import italic from '../../assets/italic.svg'
import underline from '../../assets/underline.svg'
import { Editor } from 'react-draft-wysiwyg'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { FC, useState } from 'react'
import { purple, grey } from '@mui/material/colors';

export interface TextEditorInfo {
  editorState: EditorState
  setEditorState: (editorState: EditorState) => void
}
interface TextEditorProps {
  editorInfo?: TextEditorInfo
  error?: boolean
  errorMsg?: string
}

export function convertToPlainText(articleContent: string) {
    let output: string
    try {
        output = convertFromRaw(JSON.parse(articleContent)).getPlainText()   
    } catch (error) {
        output = articleContent
    }
    return output
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
  
  const [focus, setFocus] = useState(false)

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
          width={'89%'}
          height={'182px'}
          sx={{
            padding: '16.5px 14px',
            wordBreak: 'break-all',
            overflowY: 'scroll',
            border: focus ? 2 : 1,
            borderColor: error ? 'error.main' : focus ? purple[800] : grey[500],
          }}
        >
          <Editor
            placeholder={"250 words or less"}
            editorStyle={{ fontFamily: 'Roboto', maxLines: 10, fontSize: "18px" }}
            toolbar={toolbarConfig}
            editorState={editState}
            onEditorStateChange={setEditState}
            onFocus={(_event) => setFocus(true)}
            onBlur={(_event) => setFocus(false)}
          />
        </Box>
      </Stack>
      {error && <FormHelperText sx={{pl: "120px"}} error={true}>{errorMsg}</FormHelperText>}
    </Box>
  )
}

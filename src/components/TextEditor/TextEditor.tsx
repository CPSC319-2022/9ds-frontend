import Stack from '@mui/material/Stack'
import { Typography, Box } from '@mui/material'
import { EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'
import bold from '../../assets/bold.svg'
import italic from '../../assets/italic.svg'
import underline from '../../assets/underline.svg'
import { Editor } from 'react-draft-wysiwyg'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { FC, useState } from 'react'

interface TextEditorProps {
  editorState?: EditorState
}

export const TextEditor: FC<TextEditorProps> = ({ editorState }) => {
  const [editState, setEditState] = useState(() =>
    editorState === undefined ? EditorState.createEmpty() : editorState,
  )
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
    <>
    <Stack
      direction='row'
      justifyContent={'space-between'}
      sx={{ padding: '50px 50px' }}
    >
      <Typography variant='title' sx={{ color: 'black.main' }}>
        Body
      </Typography>
      <Box
        borderRadius='4px'
        width={'80%'}
        height={'182px'}
        sx={{
          padding: '16.5px 14px',
          wordBreak: 'break-all',
          overflowY: 'scroll',
          borderColor: 'white.textBorder',
          border: 1,
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
    </>
  )
}

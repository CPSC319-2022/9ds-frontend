import { Stack, TextField, TextFieldProps } from '@mui/material'
import React, { Dispatch, FC, SetStateAction } from 'react'

type LabeledTextFieldProps = TextFieldProps & {
  onTextChange?: Dispatch<SetStateAction<string>>
  spacing?: number
  text: React.ReactNode
}

export const LabeledTextField: FC<LabeledTextFieldProps> = ({
  placeholder,
  variant,
  multiline,
  rows,
  helperText,
  error,
  onTextChange,
  spacing,
  text,
}: LabeledTextFieldProps) => {
  return (
    <Stack
      direction={'row'}
      alignItems={'flex-start'}
      justifyContent={'space-between'}
      alignSelf={'stretch'}
      spacing={spacing}
    >
      {text}
      <TextField
        multiline={multiline}
        rows={rows}
        variant={variant}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        onChange={(event) => {
          if(onTextChange) {
            onTextChange(event.target.value)
          }
          
        }}
      />
    </Stack>
  )
}

LabeledTextField.defaultProps = {
  spacing: 0,
};

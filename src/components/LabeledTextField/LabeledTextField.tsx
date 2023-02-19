import { FormLabel, Stack, TextField, TextFieldProps } from '@mui/material'
import React, { Dispatch, FC, SetStateAction } from 'react'

type LabeledTextFieldProps = TextFieldProps & {
  label: string
  onTextChange: Dispatch<SetStateAction<string>>
}

export const LabeledTextField: FC<LabeledTextFieldProps> = ({
  label,
  placeholder,
  variant,
  multiline,
  rows,
  helperText,
  error,
  onTextChange,
}: LabeledTextFieldProps) => {
  return (
    <Stack
      direction={'row'}
      alignItems={'flex-start'}
      justifyContent={'space-between'}
      alignSelf={'stretch'}
    >
      <FormLabel style={{ flex: 0.05, color: 'black' }}>{label}</FormLabel>
      <TextField
        style={{ flex: 0.95 }}
        multiline={multiline}
        rows={rows}
        variant={variant}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        onChange={(event) => {
          onTextChange(event.target.value)
        }}
      />
    </Stack>
  )
}

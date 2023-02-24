import { FormLabel, Stack, TextField, TextFieldProps } from '@mui/material'
import React, { Dispatch, FC, SetStateAction } from 'react'

type LabeledTextFieldProps = TextFieldProps & {
  label: string
  onTextChange: Dispatch<SetStateAction<string>>
  spacing?: number
  flex?:number
}

export const LabeledTextField: FC<LabeledTextFieldProps> = ({
  label,
  placeholder,
  variant,
  multiline,
  rows,
  onTextChange,
  spacing,
  flex,
}: LabeledTextFieldProps) => {
  return (
    <Stack
      direction={'row'}
      alignItems={'flex-start'}
      justifyContent={'space-between'}
      alignSelf={'stretch'}
      spacing={spacing}
    >
      <FormLabel style={{ flex: flex, color: 'black' }}>{label}</FormLabel>
      <TextField
        style={{ flex: 0.95 }}
        multiline={multiline}
        rows={rows}
        variant={variant}
        placeholder={placeholder}
        onChange={(event) => {
          onTextChange(event.target.value)
        }}
      />
    </Stack>
  )
}

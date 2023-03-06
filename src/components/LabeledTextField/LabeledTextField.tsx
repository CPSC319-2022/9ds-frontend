import { Stack, TextField, TextFieldProps, Typography } from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'
import React, { Dispatch, FC, SetStateAction } from 'react'

type LabeledTextFieldProps = TextFieldProps & {
  label: string
  onTextChange: Dispatch<SetStateAction<string>>
  spacing?: number
  flex?:number
  typographyVariant: Variant
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
  spacing,
  flex,
  typographyVariant,
}: LabeledTextFieldProps) => {
  return (
    <Stack
      direction={'row'}
      alignItems={'flex-start'}
      justifyContent={'space-between'}
      alignSelf={'stretch'}
      spacing={spacing}
    >
      <Typography variant={typographyVariant} style={{ flex: flex, color: 'black'}}>{label}</Typography>
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

LabeledTextField.defaultProps = {
  spacing: 0,
  flex:0,
};

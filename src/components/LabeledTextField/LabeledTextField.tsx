import { Grid, TextField, TextFieldProps } from '@mui/material'
import React, { Dispatch, FC, SetStateAction } from 'react'

type LabeledTextFieldProps = TextFieldProps & {
  spacing?: number
  onTextChange?: Dispatch<SetStateAction<string>>
  labelWidth: number
  columnSpacing?: number
  text: React.ReactNode
  isDisabled?: boolean
}

export const LabeledTextField: FC<LabeledTextFieldProps> = ({
  placeholder,
  variant,
  multiline,
  rows,
  helperText,
  error,
  onTextChange,
  columnSpacing,
  labelWidth,
  text,
  value,
  isDisabled,
}: LabeledTextFieldProps) => {
  return (
    <Grid container columnSpacing={columnSpacing} alignSelf={'stretch'}>
      <Grid item xs={labelWidth}>
        {text}
      </Grid>
      <Grid item xs={12 - labelWidth}>
        <TextField
          disabled={isDisabled}
          value={value}
          fullWidth
          multiline={multiline}
          rows={rows}
          variant={variant}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          onChange={(event) => {
            if (onTextChange) {
              onTextChange(event.target.value)
            }
          }}
        />
      </Grid>
    </Grid>
  )
}

LabeledTextField.defaultProps = {
  columnSpacing: 0,
}

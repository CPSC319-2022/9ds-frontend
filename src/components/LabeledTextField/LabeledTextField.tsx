import { Grid, InputProps, TextField, TextFieldProps } from '@mui/material'
import React, { Dispatch, FC, SetStateAction } from 'react'

type LabeledTextFieldProps = TextFieldProps & {
  spacing?: number
  onTextChange?: Dispatch<SetStateAction<string>>
  labelWidth: number
  columnSpacing?: number
  text: React.ReactNode
  inputProps?: InputProps
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
  inputProps,

}: LabeledTextFieldProps) => {
  return (
    <Grid container columnSpacing={columnSpacing} alignSelf={'stretch'}>
      <Grid item xs={labelWidth}>
        {text}
      </Grid>
      <Grid item xs={12 - labelWidth}>
        <TextField
          value={value}
          fullWidth
          multiline={multiline}
          rows={rows}
          variant={variant}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          InputProps={inputProps}
          onChange={(event) => {
            if(onTextChange) {
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

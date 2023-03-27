import { Grid, TextField, TextFieldProps, Typography } from '@mui/material'
import React, { Dispatch, FC, SetStateAction } from 'react'

type LabeledTextFieldProps = TextFieldProps & {
  spacing?: number
  onTextChange?: Dispatch<SetStateAction<string>>
  labelWidth: number
  columnSpacing?: number
  text: React.ReactNode
  type: 'TextField' | 'Typography'
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
  type,
}: LabeledTextFieldProps) => {
  return (
    <Grid container columnSpacing={columnSpacing} alignSelf={'stretch'}>
      <Grid item xs={labelWidth}>
        {text}
      </Grid>
      <Grid item xs={12 - labelWidth}>
        {type === 'TextField' ? (
          <TextField
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
        ) : type === 'Typography' ? (
          <Typography sx={{borderBottom: '1px solid', width: '220px'}}>{value as string}</Typography>
        ) : null}
      </Grid>
    </Grid>
  )
}

LabeledTextField.defaultProps = {
  columnSpacing: 0,
  type: 'TextField'
}

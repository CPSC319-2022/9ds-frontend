import { FormLabel, Stack, TextField, TextFieldProps } from '@mui/material'

type LabeledTextFieldProps = TextFieldProps & {
  label: string
  onTextChange: React.Dispatch<React.SetStateAction<string>>
}

export const LabeledTextField = ({
  label,
  placeholder,
  variant,
  multiline,
  rows,
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
        onChange={(event) => {
          onTextChange(event.target.value)
        }}
      />
    </Stack>
  )
}

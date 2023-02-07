import { FormLabel, Stack, TextField } from '@mui/material'

interface LabeledTextFieldProps {
  label: string
  placeholder: string
  variant: 'filled' | 'standard' | 'outlined' | undefined
  multiline: boolean
  rows?: number
  onChange: React.Dispatch<React.SetStateAction<string>>
}

const LabeledTextField = ({
  label,
  placeholder,
  variant,
  multiline,
  rows,
  onChange,
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
          onChange(event.target.value)
        }}
      />
    </Stack>
  )
}

export default LabeledTextField

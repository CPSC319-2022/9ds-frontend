import { FormLabel, Stack, TextField, TextFieldProps } from '@mui/material'

type LabeledTextFieldProps = TextFieldProps & {
  label: string
  onTextChange: React.Dispatch<React.SetStateAction<string>>
}

//This is an interesting case: don't know why it's showing error unless I
//explicitly define Props (in like 17) on top of defining it in line 10
export const LabeledTextField: React.FC<LabeledTextFieldProps> = ({
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

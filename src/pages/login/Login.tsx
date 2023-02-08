import {Box, Button, Stack, TextField, Typography} from '@mui/material'
import {styled, ThemeProvider} from "@mui/material/styles";
import * as React from "react";

const LogInWithEmailButton = styled(Button)({
  boxShadow: 'none',
  width: '235px',
  height: '42px',
  padding: '6px 22px 6px 16px',
  border: '1px solid',
  borderRadius: '4px',
  fontWeight: 'button.fontWeight',
  fontSize: 'button.fontSize',
  lineHeight: 'button.lineHeight',
  letterSpacing: 'button.letterSpacing',
  backgroundColor: 'white',
  borderColor: 'grey',
  fontColor: 'black'
})

const LogInButton = styled(Button)({
  width: '89px',
  height: '36px',
  padding: '6px 16px',
  borderRadius: '4px',
  fontWeight: 'button.fontWeight',
  fontSize: 'button.fontSize',
  lineHeight: 'button.lineHeight',
  letterSpacing: 'button.letterSpacing',
  backgroundColor: 'black',
  borderColor: 'grey'
})

export function Login() {
  return (
      <Box sx={{
        Width:"390px",
        Height:"314px",
        backgroundColor: "#F8F8FA",
        borderRadius: "12px"
      }}>
        {/*not sure what to put at spacing*/}
        <Stack spacing={3}>
          <LogInWithEmailButton variant="outlined">LOGIN WITH EMAIL</LogInWithEmailButton>
          <TextField id="email" label="Email" variant="outlined" />
          {/*TODO add input Adornments red eye icon, visibilityOnOff*/}
          <TextField id="password" label="Password" variant="outlined" />
          {/*TODO should align to right*/}
          <Stack
              direction="row"
              alignItems='flex-end'
              justifyContent="flex-end"
          >
            <LogInButton variant="contained">LOGIN</LogInButton>
          </Stack>
        </Stack>
      </Box>
  )
}

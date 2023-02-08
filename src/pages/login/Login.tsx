import {Box, Button, Stack, TextField, Typography} from '@mui/material'
import {styled, ThemeProvider} from "@mui/material/styles";
import * as React from "react";

const LogInWithEmailButton = styled(Button)({
  boxShadow: 'none',
  minWidth: '178px',
  maxWidth:'178px',
  minHeight:'42px',
  maxHeight: '42px',
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
        minWidth:"390px",
        maxWidth:'390px',
        minHeight:'314px',
        maxHeight:"314px",
        backgroundColor: "#F8F8FA",
        borderRadius: "12px"
      }}>
        {/*not sure what to put at spacing*/}
        <Stack spacing={3}>
          <LogInWithEmailButton variant="outlined">LOGIN WITH EMAIL</LogInWithEmailButton>
          <TextField id="email" label="Email" variant="outlined" style={{ width: '326px',
            height: '56px',}}/>
          {/*TODO add input Adornments red eye icon, visibilityOnOff*/}
          <TextField id="password" label="Password" variant="outlined" style={{ width: '326px',
            height: '56px',}}/>
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

import * as React from 'react';
import {Card, CardContent, Stack, TextField, Button, Typography, Box} from '@mui/material';

import {createTheme, styled} from '@mui/material/styles';
import {ThemeProvider} from '@mui/material/styles';
import {theme} from '../../theme';

//import googleIcon from './googleIcon.png';

const SignUpWithGoogleButton = styled(Button)({
    boxShadow: 'none',
    minWidth: '235px',
    maxWidth: '235px',
    minHeight: '42px',
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

const SignUpButton = styled(Button)({
    minWidth: '89px',
    maxWidth: '89px',
    minHeight: '36px',
    maxHeight: '36px',
    padding: '6px 16px',
    borderRadius: '4px',
    fontWeight: 'button.fontWeight',
    fontSize: 'button.fontSize',
    lineHeight: 'button.lineHeight',
    letterSpacing: 'button.letterSpacing',
    backgroundColor: 'black',
    borderColor: 'grey'
})



const theme2 = createTheme();
theme2.typography.body1 = {
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '120%',
    letterSpacing: 0
}



export function SignUp(){
    return (
        <Box sx={{
            minWidth:"390px",
            maxWidth:'390px',
            minHeight:'524px',
            maxHeight:"524px",
            backgroundColor: "#F8F8FA",
            borderRadius: "12px"
        }}>
                {/*not sure what to put at spacing*/}
                <Stack spacing={3}>
                {/*TODO import google png, allignment, font color, shadow*/}
                <SignUpWithGoogleButton variant="outlined">SIGNUP WITH GOOGLE</SignUpWithGoogleButton>
                    <ThemeProvider theme={theme2}>
                        <Typography variant="body1">Or</Typography>
                    </ThemeProvider>
                <TextField id="name" label="Name" variant="outlined" style={{ width: '326px',
                    height: '56px',}}/>
                <TextField id="email" label="Email" variant="outlined" style={{ width: '326px',
                    height: '56px',}}/>
                {/*TODO add input Adornments red eye icon, visibilityOnOff*/}
                <TextField id="password" label="Password" variant="outlined" style={{ width: '326px',
                    height: '56px',}}/>
                <TextField id="profImgLink" label="Profile image link" variant="outlined" style={{ width: '326px',
                    height: '56px',}}/>
                <SignUpButton variant="contained">SIGN UP</SignUpButton>
                </Stack>
        </Box>
    )
}


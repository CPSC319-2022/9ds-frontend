import * as React from 'react';
import {Card, CardContent, Stack, TextField, Button, Typography, Box} from '@mui/material';

import {createTheme, styled} from '@mui/material/styles';
import {ThemeProvider} from '@mui/material/styles';
import {theme} from '../../theme';

//import googleIcon from './googleIcon.png';

const SignUpWithGoogleButton = styled(Button)({
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

const SignUpButton = styled(Button)({
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

const inputTextField = styled(TextField) ({
    width: '326px',
    height: '56px',
    left: '32px',
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
            Width:"390px",
            Height:"524px",
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
                <TextField id="name" label="Name" variant="outlined" />
                <TextField id="email" label="Email" variant="outlined" />
                {/*TODO add input Adornments red eye icon, visibilityOnOff*/}
                <TextField id="password" label="Password" variant="outlined" />
                <TextField id="profImgLink" label="Profile Image Link" variant="outlined" />
                <SignUpButton variant="contained">SIGN UP</SignUpButton>
                </Stack>
        </Box>
    )
}


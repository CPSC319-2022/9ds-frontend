import * as React from 'react';
import {
    Stack,
    TextField,
    Button,
    Typography,
    Box,
} from '@mui/material';
import {createTheme, styled} from '@mui/material/styles';
import {ThemeProvider} from '@mui/material/styles';
import {theme} from '../../theme';

import googleIcon from '../../ui/googleIcon.png'

const SignUpWithGoogleButton = styled(Button)({
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

// TODO: gap
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

            <Stack spacing={20/8}>
                {/* TODO alignment, font color, add top gap */}
                <SignUpWithGoogleButton sx = {{boxShadow:2, left:'32px'}} variant="outlined" >
                    <Stack direction="row" alignItems="center" justifyContent="center" gap='8px'>
                        <img src={googleIcon} width='24px' height='25px'/>
                        SIGNUP WITH GOOGLE
                    </Stack>
                </SignUpWithGoogleButton>
                <ThemeProvider theme={theme2}>
                    <Stack direction="row" alignItems="center" justifyContent="center">
                        <Typography variant="body1">Or</Typography>
                    </Stack>
                </ThemeProvider>
                <TextField id="name" label="Name" variant="outlined" style={{ width: '326px',
                    height: '56px', left:'32px'}}/>
                <TextField id="email" label="Email" variant="outlined" style={{ width: '326px',
                    height: '56px', left:'32px'}}/>
                {/*TODO add input Adornments red eye icon, visibilityOnOff*/}
                <TextField id="password" label="Password" variant="outlined" style={{ width: '326px',
                    height: '56px', left:'32px'}}/>
                <TextField id="profImgLink" label="Profile image link" variant="outlined" style={{ width: '326px',
                    height: '56px', left:'32px'}}/>
                <SignUpButton variant="contained" style={{left:'32px'}}>SIGN UP</SignUpButton>
            </Stack>
        </Box>
    )
}


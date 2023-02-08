import * as React from 'react';
import {Typography, Stack} from '@mui/material';
import {ThemeProvider, createTheme} from "@mui/material/styles";
import {theme} from "../../theme";

const theme2 = createTheme();
theme2.typography.h5 = {
    fontFamily: 'Roboto',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '120%',
    letterSpacing: 0,
}

export function GetStarted(){
    return(
        <ThemeProvider theme={theme}>
            <Stack
                justifyContent="center"
                alignItems="center"
                spacing={10/8}
            >
                <Typography variant="h3">Get Started</Typography>
                <ThemeProvider theme={theme2}>
                    <Typography variant="h5">Start contributing by logging in or signing up</Typography>
                </ThemeProvider>
            </Stack>
        </ThemeProvider>
    )
}


import * as React from 'react';
import {Typography, Stack} from '@mui/material';

export const GetStartedTitle = () => {
    return(
            <Stack
                justifyContent="center"
                alignItems="center"
                spacing={10}
                p='10px'
            >
                <Typography variant="h3">Get Started</Typography>
                <Typography variant="subheading" sx={{fontSize:'20px'}}>
                    Start contributing by logging in or signing up
                </Typography>
            </Stack>
    )
}

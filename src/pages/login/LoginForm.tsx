import {Button, IconButton, Stack, TextField, Typography} from '@mui/material'
import * as React from 'react';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const LoginForm = () => {

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    return (
        <Stack
            width='390px'
            direction='column'
            justifyContent='flex-start'
            alignItems='stretch'
            borderRadius='12px'
            sx={{backgroundColor: 'white.light'}}
            p='32px'
            spacing={24}
        >
            {/*<div id='signInGoogle'></div>*/}
            <TextField id='email' label='Email' variant='outlined' />
            <FormControl variant='outlined'>
                <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
                <OutlinedInput
                    id='outlined-adornment-password'
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position='end'>
                            <IconButton
                                aria-label='toggle password visibility'
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge='end'
                            >
                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                            </IconButton>
                        </InputAdornment>
                    }
                    label='Password'
                />
            </FormControl>
            <Stack
                direction='row'
                alignItems='flex-end'
                justifyContent='flex-end'
            >
                <Button variant='contained' sx={{
                    alignSelf:'flex-start',
                    backgroundColor: 'black.main', }}>
                    <Typography variant='button'>LOGIN</Typography>
                </Button>
            </Stack>
        </Stack>

    )
}

export default LoginForm
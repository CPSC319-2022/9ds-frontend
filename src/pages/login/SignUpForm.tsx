import * as React from 'react';
import {
    Stack,
    TextField,
    Button,
    Typography,
    IconButton,
} from '@mui/material';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import googleIcon from '../../assets/googleIcon.png'

const SignUpForm = () => {

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
                <Button sx={{padding:'6px 22px 6px 16px', boxShadow: 2, alignSelf:'flex-start'}} variant='outlined'>
                    <Stack direction='row' alignItems='center' justifyContent='space-around'  spacing={8}>
                        <img src={googleIcon} width='24px' height='25px' />
                        <Typography variant='button'>SIGNUP WITH GOOGLE</Typography>
                    </Stack>
                </Button>
                    <Stack direction='row' alignItems='center' justifyContent='space-around' spacing={24}>
                        <Typography variant='body1.medium' sx={{fontSize:'14px', weight:600}}>Or</Typography>
                    </Stack>
                <TextField id='name' label='Name' variant='outlined'/>
                <TextField id='email' label='Email' variant='outlined'/>

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

                <TextField id='profImgLink' label='Profile image link' variant='outlined'/>
                <Button variant='contained' sx={{
                    alignSelf:'flex-start',
                    backgroundColor: 'black.main', }}>
                    <Typography variant='button'>
                        SIGN UP
                    </Typography>
                </Button>
            </Stack>
    )
}

export default SignUpForm


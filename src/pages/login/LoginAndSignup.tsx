import {Divider, Stack, ThemeProvider} from "@mui/material";
import {SignUp} from "./SignUp";
import {Login} from "./Login";

export const LoginAndSignup = () => {
    return (
            <Stack direction='row' spacing ={62} px='25px' alignItems='center' justifyContent='center'>
            <SignUp/>
                <Divider orientation='vertical' sx={{ borderColor:'black.main', height:'300px'}}>
                </Divider>
            <Login/>
            </Stack>
    )
}
import {Box, Divider, Stack, ThemeProvider} from "@mui/material";
import {SignUp} from "./SignUp";
import {Login} from "./Login";
import { theme } from "../../theme";


export function LoginAndSignup() {
    return (

        <ThemeProvider theme={theme}>
            <Stack direction='row' spacing ={62} px='25px' alignItems='center' justifyContent='center'>
            <SignUp></SignUp>
                <Divider orientation='vertical' sx={{ borderColor:'black.main', height:'300px'}}>
                </Divider>
            <Login></Login>
            </Stack>
        </ThemeProvider>
    )
}
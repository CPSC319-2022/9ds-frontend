import {Box, Stack} from "@mui/material";
import {SignUp} from "./SignUp";
import {Login} from "./Login";


export function LoginAndSignup() {
    return (
        <Box>
            <Stack direction="row" spacing ={5}>
            <SignUp></SignUp>
            {/*vertical divider*/}
            <Login></Login>
            </Stack>
        </Box>
    )
}
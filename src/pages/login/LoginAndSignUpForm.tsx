import {Divider, Stack} from "@mui/material";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";

const LoginAndSignUpForm = () => {
    return (
            <Stack direction='row' spacing ={62} px='25px' alignItems='center' justifyContent='center'>
            <SignUpForm/>
                <Divider orientation='vertical' sx={{ borderColor:'black.main', height:'300px'}}>
                </Divider>
            <LoginForm/>
            </Stack>
    )
}

export default LoginAndSignUpForm
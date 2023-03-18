import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { purple } from "@mui/material/colors";
import  { FC, ReactNode } from "react";

export const Spinner: FC = () => {
    return (
        <Box sx={{color: purple[800], pt: "15%", pb: '15%'}}>
            <CircularProgress size="5rem" color="inherit" />
        </Box>
    )
}

export function handleLoading(loading: boolean, component: ReactNode) {
    if (loading) {
        return <Spinner />
    } else {
        return component
    }
}
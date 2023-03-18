import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { purple } from "@mui/material/colors";
import  { FC, ReactNode } from "react";

export const Spinner: FC = () => {
    return (
        <Box sx={{color: purple[800]}}>
            <CircularProgress sx={{width: "15%"}} />
        </Box>
    )
}

export function handleLoading(loading: boolean, component: ReactNode): ReactNode {
    if (loading) {
        return <Spinner />
    } else {
        return component
    }
}
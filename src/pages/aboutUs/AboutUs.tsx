import React, { FC } from 'react'
import { AppWrapper } from '../../components/AppWrapper'
import {Typography, Stack} from '@mui/material';
import { AboutUsCard } from '../../components/AboutUsCard';
import catProfilePic from '../../assets/catProfilePic.png'
import brianPic from '../../assets/brian.jpg'
import ahnafPic from '../../assets/ahnaf.png'

export const AboutUs: FC = () => {
    return (
        <AppWrapper>
            <Stack
                direction="column"
                justifyContent="space-evenly"
                alignItems="center"
                spacing={60}
                px='145px'
                py='59px'
            >
                <Typography variant="h2">About the 9 Dudes</Typography>
                <Stack
                    direction="column"
                    justifyContent="space-between"
                    alignItems="stretch"
                    spacing={72}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="stretch"
                        spacing={57}
                    >
                        <AboutUsCard
                            picture ={ahnafPic}
                            fullName ={"Ahnaf Muqset Haque"}
                            title = {"Design and Frontend Lead"}
                            description = {""}
                        />
                        <AboutUsCard
                            picture ={catProfilePic}
                            fullName ={"Andy Dong"}
                            title = {"Testing Lead"}
                            description = {"I love dogs more"}
                        />
                        <AboutUsCard
                            picture ={catProfilePic}
                            fullName ={"Anton Grier"}
                            title = {"Frontend Dev"}
                            description = {""}
                        />

                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="stretch"
                        spacing={57}
                    >
                        <AboutUsCard
                            picture ={brianPic}
                            fullName ={"Brian Chang"}
                            title = {"Devops and Frontend Dev"}
                            description = {"CS student at UBC"}
                        />
                        <AboutUsCard
                            picture ={catProfilePic}
                            fullName ={"Jay Ho"}
                            title = {"Project Manager"}
                            description = {""}
                        />
                        <AboutUsCard
                            picture ={"data:image/png;base64,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"}
                            fullName ={"Ken Yu"}
                            title = {"Frontend Dev"}
                            description = {"CS student at UBC"}
                        />
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="stretch"
                        spacing={57}
                    >
                        <AboutUsCard
                            picture ={"https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDMzNjE3NWZjOTUxOWUwZTM3YjE5MTY4ZjBlYWFmZWQzOWRjYzlmMSZjdD1n/jUwpNzg9IcyrK/giphy.gif"}
                            fullName ={"Luke Nguyen"}
                            title = {"DevOps Lead"}
                            description = {"Nani o shite iru ka ga jibun mo wakaranai"}
                        />
                        <AboutUsCard
                            picture ={catProfilePic}
                            fullName ={"Patrick Gousseau"}
                            title = {"Frontend Dev"}
                            description = {""}
                        />
                        <AboutUsCard
                            picture ={catProfilePic}
                            fullName ={"Stuart Livingstone"}
                            title = {"Database Administrator"}
                            description = {""}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </AppWrapper>
    )
}

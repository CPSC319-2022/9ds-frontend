import React, { FC } from 'react'
import { AppWrapper } from '../../components/AppWrapper'
import { Typography, Stack } from '@mui/material'
import { AboutUsCard } from '../../components/AboutUsCard'
import brianPic from '../../assets/brian.jpg'
import ahnafPic from '../../assets/ahnaf.png'
import stuartPic from '../../assets/stuart.JPG'
import antonPic from '../../assets/anton.jpg'
import jayPic from '../../assets/jay.jpg'
import andyPic from '../../assets/andy.jpg'
import patrickPic from '../../assets/patrick.jpg'
import kenPic from '../../assets/ken.JPG'
import lukePic from '../../assets/luke.jpg'


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
                    data-testid="about-us-stack"
                    direction="column"
                    justifyContent="space-between"
                    alignItems="stretch"
                    spacing={72}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="stretch"
                        data-testid='about-us-row'
                        spacing={57}
                    >
                        <AboutUsCard
                            picture ={ahnafPic}
                            fullName ={"Ahnaf Muqset Haque"}
                            title = {"Design and Frontend Lead"}
                            description = {""}
                        />
                        <AboutUsCard
                            picture ={andyPic}
                            fullName ={"Andy Dong"}
                            title = {"Testing Lead"}
                            description = {""}
                        />
                        <AboutUsCard
                            picture ={antonPic}
                            fullName ={"Anton Grier"}
                            title = {"Frontend Dev"}
                            description = {""}
                        />

                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="stretch"
                        data-testid='about-us-row'
                        spacing={57}
                    >
                        <AboutUsCard
                            picture ={brianPic}
                            fullName ={"Brian Chang"}
                            title = {"Devops and Frontend Dev"}
                            description = {""}
                        />
                        <AboutUsCard
                            picture ={jayPic}
                            fullName ={"Jay Ho"}
                            title = {"Project Manager"}
                            description = {""}
                        />
                        <AboutUsCard
                            picture ={kenPic}
                            fullName ={"Ken Yu"}
                            title = {"Frontend Dev"}
                            description = {""}
                        />
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="stretch"
                        data-testid='about-us-row'
                        spacing={57}
                    >
                        <AboutUsCard
                            picture ={lukePic}
                            fullName ={"Luke Nguyen"}
                            title = {"DevOps Lead"}
                            description = {""}
                        />
                        <AboutUsCard
                            picture ={patrickPic}
                            fullName ={"Patrick Gousseau"}
                            title = {"Frontend Dev"}
                            description = {""}
                        />
                        <AboutUsCard
                            picture ={stuartPic}
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

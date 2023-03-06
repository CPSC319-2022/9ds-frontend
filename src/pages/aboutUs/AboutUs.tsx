import React, { FC } from 'react'
import { AppWrapper } from '../../components'
import {Typography, Stack} from '@mui/material';
import { AboutUsCard } from '../../components/AboutUsCard';
import catProfilePic from '../../assets/catProfilePic.png'

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
                        <TestAboutUsCard /><TestAboutUsCard /><TestAboutUsCard />
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="stretch"
                        spacing={57}
                    >
                        <TestAboutUsCard /><TestAboutUsCard /><TestAboutUsCard />
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="stretch"
                        spacing={57}
                    >
                        <TestAboutUsCard /><TestAboutUsCard /><TestAboutUsCard />
                    </Stack>
                </Stack>
            </Stack>
        </AppWrapper>
    )
}


// for displaying
const fullName = "Full Name"
const title = "Title goes here"
const description = "blog description here blabl ablablal abbalb ladnfisjn" +
    "  sdjfnsjblog description here blabl ablablal abbalb ladnfisjn  sdjfnsjladnfion here blabl ablablal"

const TestAboutUsCard = () => {
    return (
        <AboutUsCard
            picture ={catProfilePic}
            fullName ={fullName}
            title = {title}
            description = {description}
        />
    )
}
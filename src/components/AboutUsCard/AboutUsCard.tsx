import React, { FC } from 'react'
import {Typography, Stack} from '@mui/material';

type AboutUsCardProps = {
    picture: string
    fullName: string
    title: string
    description: string
}

export const AboutUsCard: FC<AboutUsCardProps> = ({
    picture,
    fullName,
    title,
    description
}) => {
    return (
        <Stack
            width='345px'
            height='288px'
            direction='column'
            justifyContent='center'
            alignItems='center'
            borderRadius='12px'
            sx={{backgroundColor: 'white.grey'}}
            spacing={12}
            px='20.5px'
            py='12px'
        >
            <img
                src={picture}
                width='140px'
                height='140px'
                style={{borderRadius: '50%', objectFit: 'cover'}}
            />
            <Typography
                variant='h5'
                sx={{
                    color: 'black.main',
                    textTransform: 'none',
                }}
            >
                {fullName}
            </Typography>
            <Typography
                variant='subheading'
                sx={{
                    color: 'black.main',
                    textTransform: 'none',
                }}
            >
                {title}
            </Typography>
            <Typography
                variant='caption'
                paragraph
                sx={{
                    color: 'black.main',
                    textTransform: 'none',
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                }}
            >
                {description}
            </Typography>
        </Stack>
    )
}
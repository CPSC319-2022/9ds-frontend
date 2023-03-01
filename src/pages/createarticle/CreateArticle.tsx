import { Box, Button, FormLabel, Stack } from '@mui/material'
import { Container } from '@mui/system'
import React, { useState, useEffect } from 'react'
import { LabeledTextField } from '../../components/LabeledTextField'

/* eslint-disable @typescript-eslint/no-unused-vars */

const pictureUrls = [
  'https://via.placeholder.com/150',
  'https://via.placeholder.com/150',
  'https://via.placeholder.com/150',
  'https://via.placeholder.com/150',
  'https://via.placeholder.com/150',
  'https://via.placeholder.com/150',
]

export const CreateArticle = () => {
  const [pictureIndexStart, setPictureIndexStart] = useState(0)
  const [selectedPictureIndex, setSelectedPictureIndex] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    console.log(selectedPictureIndex)
  }, [selectedPictureIndex])
  return (
    <Container>
      <form
        style={{
          alignSelf: 'stretch',
          justifyItems: 'space-between',
          flex: 1,
        }}
      >
        <Stack
          direction='column'
          justifyContent='flex-start'
          alignItems='flex-start'
          spacing={40}
        >
          <Button
            variant='contained'
            style={{ backgroundColor: 'black', alignSelf: 'flex-end' }}
          >
            SAVE DRAFT
          </Button>
          <FormLabel style={{ color: 'black' }}>Pick an image</FormLabel>
          <Stack
            justifyContent={'space-between'}
            alignSelf={'stretch'}
            direction='row'
          >
            <Button
              style={{ color: 'black' }}
              onClick={() => {
                if (pictureIndexStart - 4 < 0) {
                  setPictureIndexStart(
                    Math.ceil(pictureUrls.length / 4) * 4 - 4,
                  )
                } else {
                  setPictureIndexStart(
                    (pictureIndexStart - 4) % pictureUrls.length,
                  )
                }
              }}
            >
              {'<'}
            </Button>
            <Stack direction='row' spacing={5}>
              {Array(4)
                .fill(null)
                .map((value, index) => {
                  return (
                    <Button
                      style={{
                        backgroundColor:
                          selectedPictureIndex === pictureIndexStart + index
                            ? 'black'
                            : 'transparent',
                      }}
                      disabled={!pictureUrls[pictureIndexStart + index]}
                      key={index}
                      onClick={() => {
                        setSelectedPictureIndex(pictureIndexStart + index)
                      }}
                    >
                      <Box
                        sx={{
                          width: 150,
                          height: 150,
                          backgroundImage: `url(${
                            pictureUrls[pictureIndexStart + index]
                          })`,
                        }}
                      />
                    </Button>
                  )
                })}
            </Stack>
            <Button
              style={{ color: 'black' }}
              onClick={() => {
                if (pictureIndexStart + 4 >= pictureUrls.length) {
                  setPictureIndexStart(0)
                } else {
                  setPictureIndexStart(
                    (pictureIndexStart + 4) % pictureUrls.length,
                  )
                }
              }}
            >
              {'>'}
            </Button>
          </Stack>
          <LabeledTextField
            variant='outlined'
            onTextChange={setTitle}
            placeholder='60 words or less'
            label='Title'
            multiline={false}
            typographyVariant='h5'
          />
          <LabeledTextField
            variant='outlined'
            onTextChange={setTitle}
            placeholder='250 words or less'
            label='Body'
            multiline={true}
            rows={7}
            typographyVariant='h5'
          />
        </Stack>
        <Button
          type='submit'
          variant='contained'
          style={{ marginTop: 34, backgroundColor: 'black' }}
        >
          CREATE
        </Button>
      </form>
    </Container>
  )
}

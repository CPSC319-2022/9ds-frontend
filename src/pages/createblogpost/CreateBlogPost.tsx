import { Box, Button, FormLabel, Stack, TextField } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'

const pictureUrls = [
  'https://via.placeholder.com/150',
  'https://via.placeholder.com/150',
  'https://via.placeholder.com/150',
  'https://via.placeholder.com/150',
  'https://via.placeholder.com/150',
  'https://via.placeholder.com/150',
]

export const CreateBlogPost = () => {
  const [pictureIndexStart, setPictureIndexStart] = React.useState(0)
  const [selectedPictureIndex, setSelectedPictureIndex] = React.useState(0)
  const [title, setTitle] = React.useState('')
  const [body, setBody] = React.useState('')

  React.useEffect(() => {
    console.log(selectedPictureIndex)
  }, [selectedPictureIndex])
  return (
    <>
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
            spacing={5}
          >
            <FormLabel>Pick an image</FormLabel>
            <Stack
              justifyContent={'space-between'}
              alignSelf={'stretch'}
              direction='row'
            >
              <Button
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
            <Stack
              direction={'row'}
              alignItems={'flex-start'}
              justifyContent={'space-between'}
              alignSelf={'stretch'}
            >
              <FormLabel style={{ flex: 0.05 }}>Title</FormLabel>
              <TextField
                style={{ flex: 0.95 }}
                variant='outlined'
                placeholder='60 words or less'
                onChange={(event) => {
                  setTitle(event.target.value)
                }}
              />
            </Stack>
            <Stack
              direction={'row'}
              alignItems={'flex-start'}
              justifyContent={'space-between'}
              alignSelf={'stretch'}
            >
              <FormLabel style={{ flex: 0.05 }}>Body</FormLabel>
              <TextField
                style={{ flex: 0.95 }}
                multiline
                rows={7}
                variant='outlined'
                placeholder='250 words or less'
                onChange={(event) => {
                  setBody(event.target.value)
                }}
              />
            </Stack>
          </Stack>
          <Button type='submit' variant='contained' style={{ marginTop: 34 }}>
            CREATE
          </Button>
        </form>
      </Container>
    </>
  )
}

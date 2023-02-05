import {
  Button,
  FormGroup,
  FormLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Container } from '@mui/system'

export const CreateBlogPost = () => {
  return (
    <>
      <Container>
        <Stack
          direction='column'
          justifyContent='flex-start'
          alignItems='flex-start'
          spacing={8}
        >
          <form style={{ alignSelf: 'stretch' }}>
            <Stack direction='column' spacing={7}>
              <FormLabel>Pick an image</FormLabel>
              <Stack justifyContent={'space-between'} direction='row'>
                <Button>{'<'}</Button>
                <Stack direction='row' spacing={5}>
                  <Button>dsa</Button>
                  <Button>dsa</Button>
                  <Button>dsa</Button>
                  <Button>dsa</Button>
                </Stack>
                <Button>{'>'}</Button>
              </Stack>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  alignSelf: 'stretch',
                }}
              >
                <FormLabel style={{ flex: 0.05 }}>Title</FormLabel>
                <TextField
                  style={{ flex: 0.95 }}
                  variant='outlined'
                  placeholder='60 words or less'
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  alignSelf: 'stretch',
                }}
              >
                <FormLabel style={{ flex: 0.05 }}>Body</FormLabel>
                <TextField
                  style={{ flex: 0.95 }}
                  multiline
                  rows={7}
                  variant='outlined'
                  placeholder='250 words or less'
                />
              </div>
            </Stack>
          </form>

          <Button variant='contained'>CREATE</Button>
        </Stack>
      </Container>
    </>
  )
}

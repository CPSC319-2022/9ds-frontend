import { Box, Button, FormLabel, Stack, Typography } from '@mui/material'
import { Container } from '@mui/system'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { useState, FormEvent, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Article } from '../../hooks/firebase/useArticle'
import { useUser } from '../../hooks/firebase/useUser'
import { DeleteModal } from '../DeleteModal/DeleteModal'
import { LabeledTextField } from '../LabeledTextField'
import { TextEditor, TextEditorInfo } from '../TextEditor'

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable security/detect-object-injection */

const pictureUrls = [
  'https://media.itpro.co.uk/image/upload/v1570816541/itpro/2018/12/bigdata_shutterstock_1142996930.jpg', // Tech
  'https://www.camera-rumors.com/wp-content/uploads/2015/01/nikon-d750-sample-images.jpg', //Nature
  'https://www.pixelstalk.net/wp-content/uploads/2016/05/New-York-City-Backgrounds-HD-Pictures.jpg', //City
  'https://www.locumjobsonline.com/blog/wp-content/uploads/2018/03/what-doctors-wish-their-patients-knew.jpg', //Health
  'https://i.huffpost.com/gen/1956226/images/o-MEDITATION-facebook.jpg', //Mindfulness
  'https://dailyamazingthings.com/wp-content/uploads/2021/06/EARTH.jpg?x84511', //Earth
  'https://g.foolcdn.com/editorial/images/515923/getty-stock-market-data.jpg', //Stocks
  'https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/EPaNPEEwl/videoblocks-shot-of-stressed-business-man-in-the-office_sjv1u69im_thumbnail-1080_01.png', //Office
]

export enum ArticleFormPurpose {
  CREATE,
  UPDATE,
}

interface ArticleFormProps {
  purpose: ArticleFormPurpose
  onSubmit: (
    title: string,
    body: string,
    imagelink: string,
    published: boolean,
    articleId?: string,
  ) => void
  article?: Article
  articleId?: string
}

export const ArticleForm = ({
  purpose,
  onSubmit,
  article,
  articleId,
}: ArticleFormProps) => {
  const navigate = useNavigate()
  const { queriedUser } = useUser()
  const [pictureIndexStart, setPictureIndexStart] = useState(0)
  const [selectedPictureIndex, setSelectedPictureIndex] = useState(0)

  const [isTitleError, setIsTitleError] = useState(false)
  const [title, setTitle] = useState('')
  const [titleHelperText, setTitleHelperText] = useState('')

  const [isBodyError, setIsBodyError] = useState(false)
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  )
  const editorInfo: TextEditorInfo = { editorState, setEditorState }
  const [bodyHelperText, setBodyHelperText] = useState('')

  const [customLink, setCustomLink] = useState('')

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const allowDelete =
    articleId &&
    purpose === ArticleFormPurpose.UPDATE &&
    (queriedUser.role === 'admin' || queriedUser.uid === article?.author_uid)

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLElement>, published: boolean) => {
      let isInvalid = false
      if (title.length === 0 || countWords(title) > 60) {
        isInvalid = true
        setIsTitleError(true)
        if (title.length === 0) {
          setTitleHelperText("Title can't be empty.")
        } else {
          setBodyHelperText('Title must be 60 words or less.')
        }
      } else {
        setIsTitleError(false)
        setTitleHelperText('')
      }
      const bodyText = editorState.getCurrentContent().getPlainText()
      if (bodyText.length === 0) {
        isInvalid = true
        setIsBodyError(true)
        setBodyHelperText("Body can't be empty.")
      } else {
        setIsBodyError(false)
        setBodyHelperText('')
      }
      if (!isInvalid) {
        const encodedText = JSON.stringify(
          convertToRaw(editorState.getCurrentContent()),
        )
        if (articleId !== undefined) {
          onSubmit(
            title,
            encodedText,
            customLink.length > 0
              ? customLink
              : pictureUrls[selectedPictureIndex],
            published,
            articleId,
          )
        } else {
          onSubmit(
            title,
            encodedText,
            customLink.length > 0
              ? customLink
              : pictureUrls[selectedPictureIndex],
            published,
          )
        }
        navigate('/profile')
      }
      e.preventDefault()
    },
    [title, editorState, customLink],
  )

  useEffect(() => {
    if (article !== undefined) {
      setTitle(article.title)
      setCustomLink(article.header_image)
      if (purpose === ArticleFormPurpose.UPDATE) {
        setEditorState(() =>
          EditorState.createWithContent(
            convertFromRaw(JSON.parse(article.content)),
          ),
        )
      }
    }
  }, [])

  return (
    <Container>
      <form
        style={{
          alignSelf: 'stretch',
          justifyItems: 'space-between',
          flex: 1,
        }}
        onSubmit={(event) => {
          handleSubmit(event, true)
        }}
      >
        <Stack
          direction='column'
          justifyContent='flex-start'
          alignItems='flex-start'
          spacing={40}
        >
          {purpose === ArticleFormPurpose.CREATE && (
            <Button
              variant='contained'
              style={{ backgroundColor: 'black', alignSelf: 'flex-end' }}
              onClick={(event) => {
                handleSubmit(event, false)
              }}
            >
              SAVE DRAFT
            </Button>
          )}
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
                      aria-label='picture-selection'
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
                          backgroundSize: 'cover',
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
            onTextChange={setCustomLink}
            placeholder='Paste link to image'
            text={
              <Typography variant='title' sx={{ color: 'black' }}>
                or
              </Typography>
            }
            labelWidth={1}
            multiline={false}
            value={customLink}
          />
          <LabeledTextField
            variant='outlined'
            onTextChange={setTitle}
            placeholder='60 words or less'
            text={
              <Typography variant='title' sx={{ color: 'black' }}>
                Title
              </Typography>
            }
            labelWidth={1}
            multiline={false}
            error={isTitleError}
            helperText={titleHelperText}
            value={title}
          />
          <TextEditor
            editorInfo={editorInfo}
            error={isBodyError}
            errorMsg={bodyHelperText}
          />
        </Stack>
        <Box
          sx={{
            marginTop: 34,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            type='submit'
            variant='contained'
            style={{ backgroundColor: 'black' }}
          >
            <Typography>
              {purpose === ArticleFormPurpose.CREATE ? 'CREATE' : 'UPDATE'}
            </Typography>
          </Button>
          {allowDelete && (
            <>
              <Button
                sx={{ marginLeft: '8px' }}
                variant='contained'
                onClick={() => {
                  setDeleteModalOpen(true)
                }}
              >
                <Typography>DELETE</Typography>
              </Button>
              <DeleteModal
                articleId={articleId}
                open={deleteModalOpen}
                handleClose={() => setDeleteModalOpen(false)}
                redirect
              />
            </>
          )}
        </Box>
      </form>
    </Container>
  )
}

function countWords(text: string): number {
  return text.trim().split(' ').length
}

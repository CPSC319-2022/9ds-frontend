import { Box, Button, FormLabel, Stack, Typography } from '@mui/material'
import { Container } from '@mui/system'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { useState, FormEvent, useCallback, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Article, useUploadHeader } from '../../hooks/firebase/useArticle'
import { useUser } from '../../hooks/firebase/useUser'
import { DeleteModal } from '../DeleteModal/DeleteModal'
import { LabeledTextField } from '../LabeledTextField'
import { TextEditor, TextEditorInfo } from '../TextEditor'
import { FileUploader } from 'components/FileUploader/FileUploader'
import { NotificationContext } from 'context/NotificationContext'
import { handleLoading, Spinner } from 'components/Spinner/Spinner'

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
  DRAFT,
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
  const [file, setFile] = useState<File | null>(null)
  const { dispatch } = useContext(NotificationContext)

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


  const {uploadHeader, error: uploadError, imageURL, loading: uploadLoading} = useUploadHeader()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  useEffect(() => {
    if (!uploadError && imageURL) {
        const encodedText = JSON.stringify(
            convertToRaw(editorState.getCurrentContent()),
        )
        if (articleId !== undefined) {
            onSubmit(
            title,
            encodedText,
            imageURL,
            purpose === ArticleFormPurpose.CREATE || purpose === ArticleFormPurpose.UPDATE,
            articleId,
            )
        } else {
            onSubmit(
            title,
            encodedText,
            imageURL,
            purpose === ArticleFormPurpose.CREATE || purpose === ArticleFormPurpose.UPDATE,
            )
        }
        navigate('/profile')
    }
    if (uploadError) {
        dispatch({notificationActionType: "error", message: "Failed to upload image"})
    }
}, [imageURL, uploadError])

  const allowDelete =
    articleId &&
    purpose === ArticleFormPurpose.UPDATE &&
    (queriedUser.role === 'admin' || queriedUser.uid === article?.author_uid)

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLElement>, published: boolean) => {
      e.preventDefault()
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
      const link = customLink.length > 0
      ? customLink
      : pictureUrls[selectedPictureIndex]
      if (file && !isInvalid) {
        uploadHeader(file)
        return
      }
      if (!isInvalid) {
        const encodedText = JSON.stringify(
          convertToRaw(editorState.getCurrentContent()),
        )
        if (articleId !== undefined) {
          onSubmit(
            title,
            encodedText,
            link,
            published,
            articleId,
          )
        } else {
          onSubmit(
            title,
            encodedText,
            link,
            published,
          )
        }
        navigate('/profile')
      }
    },
    [title, editorState, customLink, selectedPictureIndex, file, imageURL],
  )


  useEffect(() => {
    if (article !== undefined) {
      setTitle(article.title)
      setCustomLink(article.header_image)
      setFile(null)
      setEditorState(() =>
        EditorState.createWithContent(
          convertFromRaw(JSON.parse(article.content)),
        ),
      )
    }
  }, [])

  const container =  (
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
          {(purpose === ArticleFormPurpose.CREATE ||
            purpose === ArticleFormPurpose.DRAFT) && (
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
                      disabled={!pictureUrls[pictureIndexStart + index]}
                      key={index}
                      onClick={() => {
                        setSelectedPictureIndex(pictureIndexStart + index)
                      }}
                    >
                      <Box
                        sx={{
                          border:
                            selectedPictureIndex === pictureIndexStart + index
                              ? '5px solid black'
                              : '0px solid black',
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
          <Stack direction={"row"} sx={{alignItems: 'flex-start', justifyContent: 'flex-start'}} spacing={80}>
          <Typography variant='title' sx={{ color: 'black' }}>
            or
          </Typography>
          <FileUploader setFile={setFile} file={file} />
          </Stack>
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
              {purpose === ArticleFormPurpose.CREATE ||
              purpose === ArticleFormPurpose.DRAFT
                ? 'CREATE'
                : 'UPDATE'}
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
  return !uploadLoading ? container : <Spinner />
}

function countWords(text: string): number {
  return text.trim().split(' ').length
}

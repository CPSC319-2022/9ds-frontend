import {
  TextField,
  Box,
  Button,
  FormLabel,
  Stack,
  Typography,
} from '@mui/material'
import { Container } from '@mui/system'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { useState, FormEvent, useCallback, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Article } from 'types/Article'
import { useUser } from '../../hooks/firebase/useUser'
import { DeleteModal } from '../DeleteModal/DeleteModal'
import { LabeledTextField } from '../LabeledTextField'
import { TextEditor, TextEditorInfo } from '../TextEditor'
import { FileUploader } from 'components/FileUploader/FileUploader'
import { NotificationContext } from 'context/NotificationContext'
import { Spinner } from 'components/Spinner/Spinner'
import { useDeleteHeader, useUploadHeader } from 'hooks/firebase/useArticle'
import { storage } from 'firebaseApp'
import { ref } from '@firebase/storage'
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
  setLoading: Function
  article?: Article
  articleId?: string
}

export const ArticleForm = ({
  purpose,
  onSubmit,
  article,
  articleId,
  setLoading,
}: ArticleFormProps) => {
  const navigate = useNavigate()
  const { queriedUser } = useUser()
  const [pictureIndexStart, setPictureIndexStart] = useState(0)
  const [selectedPictureIndex, setSelectedPictureIndex] = useState<
    number | null
  >(null)
  const [file, setFile] = useState<File | null>(null)
  const { dispatch } = useContext(NotificationContext)
  const [priorLink, setPriorLink] = useState<string | null>(null)

  const [firebaseStorageCDNLink, setFirebaseStorageCDNLink] = useState<
    string | null
  >(null)

  const [isTitleError, setIsTitleError] = useState(false)
  const [title, setTitle] = useState('')
  const [titleHelperText, setTitleHelperText] = useState('')

  const [isBodyError, setIsBodyError] = useState(false)
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  )
  const editorInfo: TextEditorInfo = { editorState, setEditorState }
  const [bodyHelperText, setBodyHelperText] = useState('')

  const [isImageError, setIsImageError] = useState(false)
  const [imageHelperText, setImageHelperText] = useState('')

  const [customLink, setCustomLink] = useState('')
  const [publishWithImage, setPublishWithImage] = useState(false)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const { deleteHeader } = useDeleteHeader()

  const [highlightedButtonId, setHighlightedButtonId] = useState(1)

  const handleButtonClick = (id: number) => {
    if (id === highlightedButtonId) {
      return
    }
    setHighlightedButtonId(id)
  }

  const [isValidImageLink, setIsValidImageLink] = useState(false)

  const checkImageURL = (url: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => reject(false)
      img.src = url
    })
  }

  useEffect(() => {
    const checkValidity = async () => {
      try {
        await checkImageURL(customLink)
        setIsValidImageLink(true)
      } catch {
        setIsValidImageLink(false)
      }
    }
    checkValidity().then((r) => {
      return r
    })
  }, [customLink, highlightedButtonId])

  const {
    uploadHeader,
    error: uploadError,
    imageURL,
    loading: uploadLoading,
  } = useUploadHeader()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  useEffect(() => {
    if (!uploadError && imageURL) {
      const encodedText = JSON.stringify(
        convertToRaw(editorState.getCurrentContent()),
      )
      setLoading(true)
      if (articleId !== undefined) {
        onSubmit(title, encodedText, imageURL, publishWithImage, articleId)
      } else {
        onSubmit(title, encodedText, imageURL, publishWithImage)
      }
      navigate('/profile')
    }
    if (uploadError) {
      dispatch({
        notificationActionType: 'error',
        message: 'Failed to upload image',
      })
    }
  }, [imageURL, uploadError])

  const isAuthorOrAdmin =
    articleId &&
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
          setTitleHelperText('Title must be 60 words or less.')
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

      if (
        selectedPictureIndex === null &&
        !file &&
        customLink.length === 0 &&
        firebaseStorageCDNLink === null
      ) {
        isInvalid = true
        setIsImageError(true)
        setImageHelperText(
          'Please pick one of the provided images or provide one yourself',
        )
      } else if (
        +(selectedPictureIndex !== null) +
          +(file !== null || firebaseStorageCDNLink !== null || false) +
          +(customLink.length > 0) >=
        2
      ) {
        isInvalid = true
        setIsImageError(true)
        setImageHelperText('Please only pick one image option')
      } else {
        setIsImageError(false)
        setImageHelperText('')
      }

      if (!isInvalid) {
        let link = ''

        if (customLink.length > 0) {
          link = customLink
        } else if (selectedPictureIndex !== null) {
          link = pictureUrls[selectedPictureIndex]
        } else {
          link = priorLink || ''
        }
        if (priorLink !== null && (priorLink !== link || file)) {
          deleteHeader(priorLink)
        }
        if (file) {
          setPublishWithImage(published)
          uploadHeader(file)
          return
        }
        const encodedText = JSON.stringify(
          convertToRaw(editorState.getCurrentContent()),
        )
        if (articleId !== undefined) {
          onSubmit(title, encodedText, link, published, articleId)
        } else {
          onSubmit(title, encodedText, link, published)
        }
        navigate('/profile')
      }
    },
    [
      title,
      editorState,
      customLink,
      selectedPictureIndex,
      file,
      imageURL,
      firebaseStorageCDNLink,
    ],
  )

  useEffect(() => {
    if (article !== undefined) {
      setTitle(article.title)
      setPriorLink(article.header_image)
      if (pictureUrls.includes(article.header_image)) {
        const defaultPicIndex = pictureUrls.indexOf(article.header_image)
        setPictureIndexStart(4 * Math.floor(defaultPicIndex / 4))
        setSelectedPictureIndex(defaultPicIndex)
      } else if (article.header_image.includes(ref(storage).bucket)) {
        setFirebaseStorageCDNLink(article.header_image)
      } else {
        setCustomLink(article.header_image)
      }

      setFile(null)
      setEditorState(() =>
        EditorState.createWithContent(
          convertFromRaw(JSON.parse(article.content)),
        ),
      )
    }
  }, [])

  const container = (
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
            purpose === ArticleFormPurpose.DRAFT ||
            purpose === ArticleFormPurpose.UPDATE) && (
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
          {isImageError && (
            <FormLabel style={{ color: 'red', marginTop: 0 }}>
              {imageHelperText}
            </FormLabel>
          )}
          <Stack
            justifyContent={'space-between'}
            alignSelf={'stretch'}
            direction='row'
          >
            <Button
              data-testid={'left'}
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
                        if (
                          selectedPictureIndex ===
                          pictureIndexStart + index
                        ) {
                          setSelectedPictureIndex(null)
                        } else {
                          setSelectedPictureIndex(pictureIndexStart + index)
                        }
                      }}
                    >
                      <Box
                        sx={{
                          border:
                            selectedPictureIndex === pictureIndexStart + index
                              ? '5px solid black'
                              : '5px solid white',
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
              data-testid={'right'}
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
          <Typography variant='title' sx={{ color: 'black' }}>
            or
          </Typography>
          <Container>
            <Stack
              direction='column'
              justifyContent='flex-start'
              alignItems='flex-start'
              spacing={40}
              sx={{ mb: '10px' }}
            >
              <FormLabel style={{ color: 'black' }}>Upload Your Own </FormLabel>
            </Stack>
            <Button
              variant='contained'
              color={highlightedButtonId === 1 ? 'success' : 'primary'}
              onClick={() => handleButtonClick(1)}
              sx={{ mb: '10px' }}
              style={{
                backgroundColor: highlightedButtonId === 1 ? 'grey' : 'white',
                color: highlightedButtonId === 1 ? 'white' : 'black',
                border: '2px solid black',
              }}
            >
              <Typography>Computer</Typography>
            </Button>
            <Button
              variant='contained'
              color={highlightedButtonId === 2 ? 'success' : 'primary'}
              onClick={() => handleButtonClick(2)}
              sx={{ mb: '10px' }}
              style={{
                backgroundColor: highlightedButtonId === 2 ? 'grey' : 'white',
                color: highlightedButtonId === 2 ? 'white' : 'black',
                border: '2px solid black',
              }}
            >
              <Typography>Web</Typography>
            </Button>
            {highlightedButtonId === 1 ? (
              <FileUploader
                setFile={(file: File | null) => {
                  setFile(file)
                  setFirebaseStorageCDNLink(null)
                }}
                file={file}
                {...(firebaseStorageCDNLink !== null
                  ? { previewFile: firebaseStorageCDNLink }
                  : {})}
              />
            ) : (
              <Stack direction='row' spacing={20} alignItems='center'>
                <TextField
                  variant='outlined'
                  onChange={(event) => setCustomLink(event.target.value)}
                  placeholder='Paste link to image'
                  multiline={false}
                  value={customLink}
                  type='TextField'
                  sx={{ width: '75%' }}
                />
                <Typography variant={'caption'} noWrap>
                  {isValidImageLink ? 'Image Found' : 'Image Not Found'}
                </Typography>
              </Stack>
            )}
          </Container>
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
            type='TextField'
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
                : isAuthorOrAdmin &&
                  purpose === ArticleFormPurpose.UPDATE &&
                  'UPDATE'}
            </Typography>
          </Button>
          {isAuthorOrAdmin &&
            (purpose === ArticleFormPurpose.UPDATE ||
              purpose === ArticleFormPurpose.DRAFT) && (
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

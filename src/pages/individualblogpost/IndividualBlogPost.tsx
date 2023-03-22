import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Article } from '../../components/Article'
import { theme } from '../../theme/Theme'
import {
  useArticleComments,
  useArticleRead,
} from '../../hooks/firebase/useArticle'
import { useNavigate, useParams } from 'react-router-dom'
import { convertFromRaw, EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import { AppWrapper } from '../../components/AppWrapper'
import { BlogMenu } from '../../components/BlogMenu/BlogMenu'
import { handleLoading } from '../../components/Spinner/Spinner'
import { useUser } from '../../hooks/firebase/useUser'
import {
  comment,
  useCommentCreate,
  useCommentDelete,
  useCommentEdit,
} from '../../hooks/firebase/useComment'
import { Timestamp } from 'firebase/firestore'
import { NotificationContext } from '../../context/NotificationContext'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useAuth } from '../../hooks/firebase/useAuth'
import { UserData } from 'types/UserData'

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable security/detect-object-injection */

const PAGINATION_COUNT = 5

export const IndividualBlogPost = () => {
  const navigate = useNavigate()
  const user: UserData = useUser().queriedUser
  const { articleId } = useParams()
  const { loading, error, article } = useArticleRead(articleId || '')
  const [title, setTitle] = useState('')
  const { dispatch } = useContext(NotificationContext)

  const defaultProfilePicture =
    'https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'

  //  eslint-disable-next-line
  const articleComments = useArticleComments(articleId!, PAGINATION_COUNT)
  const [comments, setComments] = useState<comment[]>([])
  const [commentCount, setCommentCount] = useState(0)

  const commentCreate = useCommentCreate()

  const [deletedCommentIDs, setDeletedCommentIDs] = useState<string[]>([])

  const [currComment, setCurrComment] = useState('')
  const [isCurrCommentError, setIsCurrCommentError] = useState(false)
  const [commentHelperText, setCommentHelperText] = useState('')

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  )
  const auth = useAuth()
  const commentMaxLength = 1200

  const isSignedIn = user.role !== ""

  // after useArticleComments finish, update comments
  useEffect(() => {
    // filter articleComments with deletedCommentIDs check
    // because when deleting comment it does not interact with useArticleComments.comments
    const filterDeleted = articleComments.comments.filter(
      (comment) => !deletedCommentIDs.includes(comment.commentID)
    )
    setComments(filterDeleted)
  }, [articleComments.comments])

  useEffect(() => {
    if (error) {
      dispatch({
        notificationActionType: 'error',
        message: `Error fetching comments: ${articleComments.error}`,
      })
    }
  }, [articleComments.error])

  // useEffect for rerendering the comment pushed
  useEffect(() => {
    setCommentCount(comments.length)
  }, [comments])

  useEffect(() => {
    if (!loading) {
      if (article !== undefined) {
        setTitle(article.title)
        const editState = EditorState.createWithContent(
          convertFromRaw(JSON.parse(article.content)),
        )
        setEditorState(() => editState)
      }
    }
  }, [loading])

  useEffect(() => {
    if (error) {
      navigate('/')
      throw Error('Article does not exist')
    }
  }, [error])

  const handleSubmitComment = () => {
    // eslint-disable-next-line
    commentCreate.createComment(articleId!, currComment)
  }

  // setCommentID on comment after creating using useCommentCreate
  useEffect(() => {
    if (commentCreate.commentId) {
      const commentToSubmit: comment = {
        commenter_uid: user.uid,
        commenter_image: user.profile_image,
        commenter_username: user.username,
        content: currComment,
        post_time: Timestamp.now(),
        commentID: commentCreate.commentId,
      }
      setComments((comments) => [commentToSubmit, ...comments])
      setCommentCount((commentCount) => commentCount + 1)
      setIsCurrCommentError(false)
      setCommentHelperText('')
      setCurrComment('')
    }
  }, [commentCreate.commentId])


  const Comment = ({
    profilePic,
    comment,
    post_time,
    commenter_uid,
    commenter_username,
    commentID
  }: CommentProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
      setAnchorEl(null)
    }
    const [isEditing, setIsEditing] = useState(false)
    const [editCommentContent, setEditCommentContent] = useState(comment)
    const [editCommentContentError, setEditCommentContentError] = useState(false)
    const [editCommentContentHelperText, setEditCommentContentHelperText] = useState('')

    const commentEdit = useCommentEdit()
    const commentDelete = useCommentDelete()
    const ownedBySignedInUser = auth.user && commenter_uid === auth.user.uid

    // character limit for reply
    useEffect(() => {
      if (currComment.length === commentMaxLength) {
        setIsCurrCommentError(true)
        setCommentHelperText(`Input limit of ${commentMaxLength} characters reached.`)
      } else {
        if (currComment.length !== 0) {
          setIsCurrCommentError(false)
          setCommentHelperText("")
        }
      }
    },[currComment])

    // character limit for editing
    useEffect(() => {
      if (editCommentContent.length === commentMaxLength) {
        setEditCommentContentError(true)
        setEditCommentContentHelperText(`Input limit of ${commentMaxLength} characters reached.`)
      } else {
        if (currComment.length !== 0) {
          setEditCommentContentError(false)
          setEditCommentContentHelperText("")
        }
      }
    },[editCommentContent])


    const handleSave = () => {
      // eslint-disable-next-line
      commentEdit.editComment(articleId!, commentID, editCommentContent)
      const updatedComments = comments.map((obj) => {
        if (obj.content === comment) {
          return { ...obj, content: editCommentContent }
        }
        return obj
      })
      setComments(updatedComments)
      setIsEditing(false)
      setEditCommentContentError(false)
      setEditCommentContentHelperText('')
    }

    const renderMenuButton: any = () => {
      if (ownedBySignedInUser) {
        return (
          <>
            <Button
              id='basic-button'
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              endIcon={<KeyboardArrowDownIcon />}
            />
            <Menu
              id='basic-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem
                sx={{
                  ':hover': {
                    bgcolor: '#A292C5',
                  },
                }}
                onClick={() => setIsEditing(true)}
              >
                <Typography variant='subheading' color='black.main'>
                  edit
                </Typography>
              </MenuItem>
              <MenuItem
                sx={{
                  ':hover': {
                    bgcolor: '#A292C5',
                  },
                }}
                onClick={() => {
                  const response = confirm(
                    'Are you sure? You cannot restore comments that have been deleted.',
                  )
                  if (response) {
                    // eslint-disable-next-line
                    commentDelete.deleteComment(articleId!, commentID)
                    setDeletedCommentIDs([...deletedCommentIDs, commentID])
                    const updatedComments = comments.filter((currComment) => currComment.commentID !== commentID)
                    setComments(updatedComments)
                    setCommentCount((commentCount) => commentCount - 1)
                    dispatch({
                      notificationActionType: 'success',
                      message: `Comment deleted.`,
                    })
                  }
                }}
              >
                <Typography variant='subheading' color='black.main'>
                  delete
                </Typography>
              </MenuItem>
            </Menu>
          </>
        )
      } else {
        if (user.role === 'admin') {
          // only has delete button
          return (
            <>
              <Button
                id='basic-button'
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
              />
              <Menu
                disableScrollLock={true}
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem
                  sx={{
                    ':hover': {
                      bgcolor: '#A292C5',
                    },
                  }}
                  onClick={() => {
                    const response = confirm(
                      'Are you sure? You cannot restore comments that have been deleted.',
                    )
                    if (response) {
                      // eslint-disable-next-line
                      commentDelete.deleteComment(articleId!, commentID)
                      setDeletedCommentIDs([...deletedCommentIDs, commentID])
                      const updatedComments =  comments.filter((currComment) => currComment.commentID !== commentID)
                      setComments(updatedComments)
                      setCommentCount((commentCount) => commentCount - 1)
                      dispatch({
                        notificationActionType: 'success',
                        message: `Comment deleted.`,
                      })
                    }
                  }}
                >
                  <Typography variant='subheading' color='black.main'>
                    delete
                  </Typography>
                </MenuItem>
              </Menu>
            </>
          )
        }
      }
    }

    return (
      <Stack
        direction='row'
        spacing={28}
        boxSizing='border-box'
        alignItems={'baseline'}
      >
        <img
          src={profilePic}
          width='42px'
          height='42px'
          style={{ borderRadius: '50%' }}
        />
        <Paper
          style={{
            borderBottomLeftRadius: 25,
            borderTopRightRadius: 25,
            padding: 15,
            backgroundColor: theme.palette.black['50%'],
            overflow: 'hidden',
            maxWidth: '1200px'
          }}
        >
          {isEditing ? (
            <>
              <TextField
                style={{ minWidth: '500px' }}
                multiline
                inputProps={{ maxLength: commentMaxLength }}
                value={editCommentContent}
                onChange={(event) => setEditCommentContent(event.target.value)}
                error={editCommentContentError}
                helperText={editCommentContentHelperText}
              />
              <Stack
                direction='row'
                justifyContent='flex-end'
                alignItems='center'
                spacing={2}
                p='10px'
              >
                <Button
                  variant='contained'
                  onClick={() => {
                    if (editCommentContent.trim() === '') {
                      setEditCommentContentError(true)
                      setEditCommentContentHelperText('comment cannot be empty.')
                    } else {
                      setEditCommentContentError(false)
                      setEditCommentContentHelperText('')
                      handleSave()
                    }
                  }}
                >
                  Save
                </Button>
              </Stack>
            </>
          ) : (
            <Stack
              direction='row'
              spacing={28}
              boxSizing='border-box'
              alignItems={'baseline'}
            >
              <Stack
                direction='column'
                spacing={10}
                boxSizing='border-box'
                alignItems={'baseline'}
              >
                <Typography
                  variant='subheading'
                  color={theme.palette.black.main}
                >
                  {commenter_username}:
                </Typography>
                <Typography
                  color={theme.palette.white.main}
                  paragraph
                  style={{
                    wordWrap: 'break-word',
                    wordBreak: 'break-all',
                    whiteSpace: 'pre-line',
                    overflow: 'hidden'
                  }}
                >
                  {comment}
                </Typography>
              </Stack>
              {renderMenuButton()}
            </Stack>
          )}
        </Paper>
      </Stack>
    )
  }

  const component = article && (
    <>
      <Stack style={{ position: 'relative', width: '100%', height: '100%' }}>
        {articleId && (
          <BlogMenu articleId={articleId} author_uid={article.author_uid} />
        )}
        <Article
          clickDisabled={true}
          size={'large'}
          article={{
            title: article.title,
            content: article.content,
            header_image: article.header_image,
            author_image: article.author_image,
            author_username: article.author_username,
            publish_time: article.publish_time,
            articleId: articleId || '',
          }}
          notFeatured={true}
        />
      </Stack>
      <Stack
        direction='column'
        alignItems='flex-start'
        spacing={32}
        alignSelf='stretch'
        paddingLeft={'32px'}
        paddingRight={'32px'}
      >
        <Typography variant='h3'>{title}</Typography>
        <Box
          width={'100%'}
          sx={{
            wordBreak: 'normal',
            padding: '2px 2px',
            alignSelf: 'flex-start',
          }}
        >
          <Editor
            toolbarHidden
            editorState={editorState}
            editorStyle={{ fontFamily: 'Roboto', fontSize: '18px' }}
            readOnly
          />
        </Box>
        <Typography style={{ alignSelf: 'flex-start' }} variant='h6'>
          Comments
        </Typography>
        {isSignedIn ? (
        <Stack
          direction='row'
          spacing={28}
          boxSizing='border-box'
          alignItems={'baseline'}
        >
          <img
            src={
              user.profile_image === ''
                ? defaultProfilePicture
                : user.profile_image
            }
            width='42px'
            height='42px'
            style={{ borderRadius: '50%' }}
          />
          <Paper
            style={{
              borderBottomLeftRadius: 25,
              borderTopRightRadius: 25,
              padding: 15,
              backgroundColor: theme.palette.black['50%'],
            }}
          >
            <TextField
              variant='standard'
              style={{ minWidth: '500px' }}
              value={currComment}
              placeholder='Comment away...'
              multiline
              inputProps={{ maxLength: commentMaxLength }}
              color='primary'
              onChange={(event) => setCurrComment(event.target.value)}
              error={isCurrCommentError}
              helperText={commentHelperText}
            />
            <Stack
              direction='row'
              justifyContent='flex-end'
              alignItems='center'
              spacing={2}
              p='10px'
            >
              <Button
                variant='contained'
                onClick={() => {
                  if (currComment.trim() === '') {
                    setIsCurrCommentError(true)
                    setCommentHelperText('Comment cannot be empty.')
                  } else {
                    if (user.role === '') {
                      setIsCurrCommentError(true)
                      setCommentHelperText('Please sign up or sign in first.')
                    } else {
                      handleSubmitComment()
                    }
                  }
                }}
              >
                REPLY
              </Button>
            </Stack>
          </Paper>
        </Stack>
          ) : (
          <Stack
            direction='row'
            spacing={28}
            boxSizing='border-box'
            alignItems={'baseline'}
          >
            <img
              src={
                'https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'
              }
              width='42px'
              height='42px'
              style={{ borderRadius: '50%' }}
            />
            <Paper
              style={{
                borderBottomLeftRadius: 25,
                borderTopRightRadius: 25,
                padding: 15,
                backgroundColor: theme.palette.black['50%'],
              }}
            >
              <Stack
                direction='row'
                justifyContent='center'
                alignItems='center'
                spacing={20}
                p='10px'
              >
                <Typography variant='h6'> Please sign in or sign up to comment</Typography>
                <Button
                  variant='outlined'
                  size='large'
                  sx={{
                    backgroundColor: 'black.main',
                    textTransform: 'none',
                    border: `2px solid 'black'`,
                    ':hover': {
                      bgcolor: '#4D3188',
                    },
                  }}
                  onClick={() => {
                    if (user.role === "") {
                      navigate('/get-started')
                    }
                  }}
                >
                  <Typography
                    variant='button'
                    noWrap
                    sx={{color: 'white.main',textTransform: 'none',}}
                  >
                    LOGIN
                  </Typography>
                </Button>
              </Stack>
            </Paper>
          </Stack>
        )}
        {new Array(commentCount).fill(0).map((_, i) => {
          return (
            <Comment
              key={i}
              profilePic={comments[i].commenter_image}
              comment={comments[i].content}
              post_time={comments[i].post_time}
              commenter_uid={comments[i].commenter_uid}
              commenter_username={comments[i].commenter_username}
              commentID={comments[i].commentID}
            />
          )
        })}
        {!articleComments.endOfCollection && (
          <Button
            variant='outlined'
            size='large'
            sx={{
              marginTop: 34,
              alignSelf: 'center',
              display: 'block',
              backgroundColor: 'black.main',
              textTransform: 'none',
              border: `2px solid 'black'`,
              ':hover': {
                bgcolor: '#4D3188',
              },
            }}
            disabled={articleComments.loadingNext}
            onClick={() => {
              articleComments.getNext(4)
            }}
          >
            <
              Typography
              variant='button'
              noWrap
              sx={{
                color: 'white.main',
                textTransform: 'none',
              }}
            >
              LOAD MORE...
            </Typography>
          </Button>
        )}
      </Stack>
    </>
  )
  return (
    <AppWrapper>{handleLoading(loading || !article, component)}</AppWrapper>
  )
}

interface CommentProps {
  profilePic: string
  comment: string
  post_time: Timestamp
  commenter_uid: string
  commenter_username: string
  commentID: string
}

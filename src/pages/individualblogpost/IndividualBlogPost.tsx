
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import {useContext, useEffect, useState } from 'react'
import { Article } from '../../components/Article'
import sample from '../../assets/sample.jpg'
import { theme } from '../../theme/Theme'
import { useArticleComments, useArticleRead } from '../../hooks/firebase/useArticle'
import { useNavigate, useParams } from 'react-router-dom'
import { convertFromRaw, EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import { AppWrapper } from '../../components/AppWrapper'
import { BlogMenu } from '../../components/BlogMenu/BlogMenu'
import { handleLoading } from '../../components/Spinner/Spinner'
import { UserData, useUser } from '../../hooks/firebase/useUser'
import { comment, useCommentCreate, useCommentDelete, useCommentEdit } from '../../hooks/firebase/useComment'
import { Timestamp } from 'firebase/firestore'
import { NotificationContext } from '../../context/NotificationContext'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import React from 'react'

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable security/detect-object-injection */

const PAGINATION_COUNT = 5

export const IndividualBlogPost = () => {
  const navigate = useNavigate()
  // load user for commenting
  const user: UserData = useUser().queriedUser
  const { articleId } = useParams()
  const { loading, error, article } = useArticleRead(articleId || '')
  const articleComments = useArticleComments(articleId!, PAGINATION_COUNT)

  const [title, setTitle] = useState('')
  // get ALL comments from firestore
  const [comments, setComments] = useState<comment[]>(useArticleComments(articleId!, 1000).comments)
  const [commentCount, setCommentCount] = useState(comments.length)
  const commentCreate = useCommentCreate()

  const [currComment, setCurrComment] = useState('')
  const [isCurrCommentError, setIsCurrCommentError] = useState(false)
  const [commentHelperText, setCommentHelperText] = useState('')

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  )
  const handleSubmitComment = () => {
      const commentToSubmit: comment = {
          commenter_uid: user.uid,
          commenter_image: user.profile_image,
          commenter_username: user.username,
          content: currComment,
          post_time: Timestamp.now()
      }

        // eslint-disable-next-line
        // commentCreate.createComment(articleId!, commentToSubmit)
      setComments((comments) => [...comments, commentToSubmit])
      setCommentCount(commentCount => commentCount + 1)
      setIsCurrCommentError(false)
      setCommentHelperText('')
      setCurrComment('')
  }

  // useEffect for rerendering the comment pushed
  useEffect(() => {
      setCurrComment('')
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



  const component = article && (
    <>
      <Stack style={{ position: 'relative', width: '100%', height: '100%' }}>
        <BlogMenu articleId={articleId ?? ''} author_uid={article.author_uid} />
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
        {new Array(commentCount).fill(0).map((_, i) => {
          return (
            <Comment
              key={i}
              profilePic={comments[i].commenter_image}
              comment={comments[i].content}
            />
          )
        })}
        <Button
          variant='contained'
          style={{
            marginTop: 34,
            backgroundColor: 'black',
            alignSelf: 'center',
            display: commentCount == comments.length ? 'none' : 'block',
          }}
          onClick={() => {
            setCommentCount(
              commentCount + PAGINATION_COUNT > comments.length
                ? comments.length
                : commentCount + PAGINATION_COUNT,
            )
          }}
        >
          LOAD MORE...
        </Button>
        <Stack
          direction='row'
          spacing={28}
          boxSizing='border-box'
          alignItems={'baseline'}
        >
          <img
            src={sample}
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
                  variant="standard"
                  style={{minWidth: '500px'}}
                  defaultValue=""
                  value={currComment}
                  placeholder="Comment away..."
                  multiline
                  color="primary"
                  onChange={(event) => setCurrComment(event.target.value)}
                  error={isCurrCommentError}
                  helperText={commentHelperText}
              />
              <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={2}
                  p="10px"
              >
                  <Button
                      variant="contained"
                      onClick={() => {
                          if (currComment.trim() === "") {
                              setIsCurrCommentError(true)
                              setCommentHelperText('Comment cannot be empty.')
                          } else {
                              handleSubmitComment()
                              setCurrComment('')
                          }
                      }}
                  >
                      REPLY
                  </Button>
              </Stack>
          </Paper>
        </Stack>
      </Stack>
    </>
  )
    const Comment = ({profilePic, comment}: CommentProps) => {
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
        const open = Boolean(anchorEl)
        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget)
        }
        const handleClose = () => {
            setAnchorEl(null)
        }
        const [isEditing, setIsEditing] = useState(false)
        const [commentContent, setCommentContent] = useState(comment)
        const [commentContentError, setCommentContentError] = useState(false)
        const [commentContentHelperText, setCommentContentHelperText] = useState("")

        const commentEdit = useCommentEdit()
        const commentDelete = useCommentDelete()

        const handleSave = () => {
            commentEdit.editComment(articleId!, "commentID", commentContent)
            // update local
            const updatedComments = comments.map((obj) => {
                if (obj.content === comment) {
                    return {...obj, content: commentContent}
                }
                return obj
            })
            setComments(updatedComments)
            setIsEditing(false)
            setCommentContentError(false)
            setCommentContentHelperText("")
        }
        const {dispatch} = useContext(NotificationContext)

        useEffect(() => {

        }, [commentEdit.loading])

        return (
            <Stack
                direction="row"
                spacing={28}
                boxSizing="border-box"
                alignItems={'baseline'}
            >
                <img
                    src={profilePic}
                    width="42px"
                    height="42px"
                    style={{borderRadius: '50%'}}
                />
                <Paper
                    style={{
                        borderBottomLeftRadius: 25,
                        borderTopRightRadius: 25,
                        padding: 15,
                        backgroundColor: theme.palette.black['50%'],
                    }}
                >
                    {isEditing ? (
                        <><TextField
                            style={{minWidth: '500px'}}
                            multiline
                            value={commentContent}
                            onChange={(event) => setCommentContent(event.target.value)}
                            error={commentContentError}
                            helperText={commentContentHelperText}
                        />
                            <Stack
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="center"
                                spacing={2}
                                p="10px"
                            >
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        if (commentContent.trim() === "") {
                                            setCommentContentError(true)
                                            setCommentContentHelperText("comment can't be empty.")
                                        } else {
                                            setCommentContentError(false)
                                            setCommentContentHelperText("")
                                            handleSave()
                                        }
                                    }}
                                >
                                    Save
                                </Button>
                            </Stack></>

                    ) : (
                        <Stack
                            direction="row"
                            spacing={28}
                            boxSizing="border-box"
                            alignItems={'baseline'}
                        >
                            <Stack
                                direction="column"
                                spacing={10}
                                boxSizing="border-box"
                                alignItems={'baseline'}>
                                <Typography variant="subheading"
                                            color={theme.palette.black.main}>{user.username}:</Typography><Typography
                                color={theme.palette.white.main}
                                style={{whiteSpace: 'pre-line'}}
                            >
                                {comment}
                            </Typography>
                            </Stack>
                            <Button
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                endIcon={<KeyboardArrowDownIcon/>}
                            />
                            <Menu
                                id="basic-menu"
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
                                    <Typography variant="subheading" color="black.main">
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

                                        const response = confirm('Are you sure? You cannot restore comments that have been deleted.')
                                        if (response) {
                                            commentDelete.deleteComment(articleId!, "commentId")
                                            // TODO if success, update local, else dispatch faillure
                                            // update local
                                            setComments((comments) => comments.filter((currComment) => currComment.content !== comment))
                                            setCommentCount(commentCount => commentCount - 1)
                                            dispatch({
                                                notificationActionType: 'success',
                                                message: `Successfully applied to become contributor!`,
                                            })
                                        }
                                    }}
                                >

                                    <Typography variant="subheading" color="black.main">
                                        delete
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </Stack>
                    )}
                </Paper>
            </Stack>
        )
    }
  return (
    <AppWrapper>{handleLoading(loading || !article, component)}</AppWrapper>
  )
}
interface CommentProps {
  profilePic: string
  comment: string
}



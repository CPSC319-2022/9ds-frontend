import { FC, useContext, useState } from 'react'
import Button from '@mui/material/Button'
import { useArticleDelete } from '../../hooks/firebase/useArticle'
import { useNavigate } from 'react-router-dom'
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { NotificationContext } from 'context/NotificationContext'

interface DeleteModalProps {
  articleId: string
  open: boolean
  handleClose: () => void
  redirect?: boolean
}

export const DeleteModal: FC<DeleteModalProps> = ({
  articleId,
  open,
  handleClose,
  redirect,
}) => {
  const navigate = useNavigate()
  const { dispatch } = useContext(NotificationContext)
  const { deleteArticle } = useArticleDelete(articleId)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteArticle()
    } catch (err) {
      dispatch({
        notificationActionType: 'error',
        message: `Error deleting article. `,
      })
    }

    setDeleting(false)
    handleClose()
    if (redirect) {
      navigate('/')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!deleting) {
          handleClose()
        }
      }}
    >
      <DialogTitle id='alert-dialog-title'>
        Are you sure you want to delete?
      </DialogTitle>
      <DialogContent>
        {deleting ? (
          <CircularProgress
            sx={{
              marginLeft: '8px',
              marginTop: '5px',
            }}
            size={20}
            data-testid='deleting-circular-progress'
          />
        ) : (
          <DialogContentText id='alert-dialog-description'>
            This action cannot be undone
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={handleClose} disabled={deleting}>
          No
        </Button>
        <Button
          variant='contained'
          color='error'
          onClick={handleDelete}
          disabled={deleting}
          data-testid='delete-confirm-button'
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

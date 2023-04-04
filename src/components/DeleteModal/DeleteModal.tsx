import { FC, useEffect, useState } from 'react'
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
  const { deleteArticle, loading, error } = useArticleDelete(articleId)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    deleteArticle()
  }

  useEffect(() => {
    if (deleting && !loading) {
      setDeleting(false)
      handleClose()
      if (redirect && !error) {
        navigate('/')
      }
    }
  }, [deleting, loading, error])

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

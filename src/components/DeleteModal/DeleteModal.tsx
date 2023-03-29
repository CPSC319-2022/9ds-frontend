import { FC, useState } from 'react'
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
  const { deleteArticle, error } = useArticleDelete(articleId)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    await deleteArticle()
    setDeleting(false)
    handleClose()
    if (redirect && !error) {
      navigate('/')
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
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
          />
        ) : (
          <DialogContentText id='alert-dialog-description'>
            This action cannot be undone
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={handleClose}>
          No
        </Button>
        <Button variant='contained' color='error' onClick={handleDelete}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

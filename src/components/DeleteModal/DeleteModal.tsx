import React, { FC, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { useArticleDelete } from '../../hooks/firebase/useArticle'
import { useNavigate } from 'react-router-dom'
import { CircularProgress } from '@mui/material'

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
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          padding: '8px',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <Typography variant='h6' component='h2'>
            Confirm Article Deletion
          </Typography>
          {deleting && (
            <CircularProgress
              sx={{
                marginLeft: '8px',
                marginTop: '5px',
              }}
              size={20}
            />
          )}
        </Box>

        <Typography sx={{ mt: 2 }}>
          Are you sure you want to delete this article?
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%',
            position: 'relative',
          }}
        >
          <Button disabled={deleting} onClick={handleDelete}>
            <Typography>Yes</Typography>
          </Button>
          <Button disabled={deleting} onClick={handleClose}>
            <Typography>No</Typography>
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

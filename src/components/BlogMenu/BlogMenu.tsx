import React, { useState, MouseEvent, FC } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useNavigate } from 'react-router-dom'
import { IconButton, Paper, Popper, Stack } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { DeleteModal } from '../DeleteModal/DeleteModal'
import { useUser } from '../../hooks/firebase/useUser'

interface BlogMenuProps {
  articleId: string
  author_uid: string
  disabled?: boolean
}

export const BlogMenu: FC<BlogMenuProps> = ({
  articleId,
  author_uid,
  disabled,
}) => {
  const { queriedUser } = useUser()
  const allowUpdate = queriedUser.uid === author_uid
  const allowDelete = queriedUser.role === 'admin' || allowUpdate
  const showMenu = allowUpdate || allowDelete

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useState<boolean>(false)

  const navigate = useNavigate()
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setOpen(!open)
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleEdit = () => {
    handleClose()
    navigate(`/update/${articleId}`)
  }

  const handleDelete = () => {
    handleClose()
    setDeleteModalOpen(true)
  }

  if (!showMenu) {
    return null
  }

  return (
    <Stack sx={{ position: 'absolute', top: '4px', right: '4px', zIndex: 1 }}>
      <IconButton
        sx={{
          backgroundColor: 'grey.500',
          '&:hover': {
            backgroundColor: 'grey.400',
          },
        }}
        disabled={disabled}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Popper anchorEl={anchorEl} open={open}>
        <Paper>
          {allowUpdate && (
            <MenuItem onClick={handleEdit}>Edit Article</MenuItem>
          )}
          {allowDelete && (
            <MenuItem onClick={handleDelete}>Delete Article</MenuItem>
          )}
        </Paper>
      </Popper>
      <DeleteModal
        articleId={articleId}
        open={deleteModalOpen}
        handleClose={() => setDeleteModalOpen(false)}
        redirect
      />
    </Stack>
  )
}

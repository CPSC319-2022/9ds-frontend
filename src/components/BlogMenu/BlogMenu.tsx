import React, { useState, MouseEvent, FC } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useNavigate } from 'react-router-dom'
import { IconButton, Stack } from '@mui/material'
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
  const allowDeleteAndUpdate =
    articleId &&
    (queriedUser.role === 'admin' || queriedUser.uid === author_uid)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const navigate = useNavigate()
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    handleClose()
    navigate(`/update/${articleId}`)
  }

  const handleDelete = () => {
    handleClose()
    setDeleteModalOpen(true)
  }

  if (!allowDeleteAndUpdate) {
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
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>Edit Article</MenuItem>
        <MenuItem onClick={handleDelete}>Delete Article</MenuItem>
      </Menu>
      <DeleteModal
        articleId={articleId}
        open={deleteModalOpen}
        handleClose={() => setDeleteModalOpen(false)}
        redirect
      />
    </Stack>
  )
}

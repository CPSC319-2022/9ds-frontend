import { Button } from '@mui/material'
import { fireEvent, render, waitFor } from '@testing-library/react'
import * as hooks from 'hooks/firebase/useArticle'
import { useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { DeleteModal } from '../../components/DeleteModal/DeleteModal'

describe('DeleteModal', () => {
  it('should open delete modal', async () => {
    jest.spyOn(hooks, 'useArticleDelete').mockImplementation(() => ({
      deleteArticle: () => Promise.resolve(),
      error: undefined,
      loading: false,
    }))
    const mockHandleClose = jest.fn()

    const TestDeleteModal = () => {
      const [open, setOpen] = useState(false)
      return (
        <div>
          <Button
            data-testid='test-delete-button'
            onClick={() => setOpen(true)}
          />
          <DeleteModal open={open} articleId='' handleClose={mockHandleClose} />
        </div>
      )
    }
    const { getByTestId, getByText } = render(
      <MemoryRouter>
        <TestDeleteModal />
      </MemoryRouter>,
    )

    const deleteButton = getByTestId('test-delete-button')
    fireEvent.click(deleteButton)
    expect(
      getByText('Are you sure you want to delete this article?'),
    ).toBeInTheDocument()

    const deleteConfirmButton = getByTestId('delete-confirm-button')

    fireEvent.click(deleteConfirmButton)
    expect(deleteConfirmButton).toBeDisabled()

    const deletingProgressSpinner = getByTestId('deleting-circular-progress')
    expect(deletingProgressSpinner).toBeInTheDocument()

    await waitFor(() => {
      expect(mockHandleClose).toHaveBeenCalled()
    })
  })
})

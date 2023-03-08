import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ArticleForm, ArticleFormPurpose } from '../../components/ArticleForm'

describe('ArticleForm', () => {
  const onSubmitMock = jest.fn()

  beforeEach(() => {
    onSubmitMock.mockClear()
  })

  it('renders title and body text field and custom link field', () => {
    render(
      <ArticleForm
        purpose={ArticleFormPurpose.UPDATE}
        onSubmit={onSubmitMock}
      />,
    )

    const allTextField = screen.getAllByRole('textbox')

    expect(allTextField.length).toBe(3)
  })

  it('renders publish and save draft buttons', () => {
    render(
      <ArticleForm
        purpose={ArticleFormPurpose.UPDATE}
        onSubmit={onSubmitMock}
      />,
    )

    const createButton = screen.getByRole('button', { name: 'UPDATE' })
    expect(createButton).toBeInTheDocument()
    const saveDraftButton = screen.queryByRole('button', { name: 'SAVE DRAFT' })
    expect(saveDraftButton).not.toBeInTheDocument()
  })
})

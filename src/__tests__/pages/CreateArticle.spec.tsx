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
        purpose={ArticleFormPurpose.CREATE}
        onSubmit={onSubmitMock}
      />,
    )

    const allTextField = screen.getAllByRole('textbox')

    expect(allTextField.length).toBe(3)
  })

  it('renders publish and save draft buttons', () => {
    render(
      <ArticleForm
        purpose={ArticleFormPurpose.CREATE}
        onSubmit={onSubmitMock}
      />,
    )

    const publishButton = screen.getByRole('button', { name: 'CREATE' })
    expect(publishButton).toBeInTheDocument()

    const saveDraftButton = screen.getByRole('button', { name: 'SAVE DRAFT' })
    expect(saveDraftButton).toBeInTheDocument()
  })
})

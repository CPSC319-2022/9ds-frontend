import { render, screen } from '@testing-library/react'
import { ArticleForm, ArticleFormPurpose } from '../../components/ArticleForm'
import { MemoryRouter as Router } from 'react-router-dom'

describe('ArticleForm', () => {
  const onSubmitMock = jest.fn()

  beforeEach(() => {
    onSubmitMock.mockClear()
  })

  it('renders title and body text field and custom link field', () => {
    render(
      <Router>
        <ArticleForm
          purpose={ArticleFormPurpose.CREATE}
          onSubmit={onSubmitMock}
        />
      </Router>,
    )

    const allTextField = screen.getAllByRole('textbox')

    expect(allTextField.length).toBe(3)
  })

  it('renders publish and save draft buttons', () => {
    render(
      <Router>
        <ArticleForm
          purpose={ArticleFormPurpose.CREATE}
          onSubmit={onSubmitMock}
        />
      </Router>,
    )

    const publishButton = screen.getByRole('button', { name: 'CREATE' })
    expect(publishButton).toBeInTheDocument()

    const saveDraftButton = screen.getByRole('button', { name: 'SAVE DRAFT' })
    expect(saveDraftButton).toBeInTheDocument()
  })
})

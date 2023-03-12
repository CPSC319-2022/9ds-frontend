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
          purpose={ArticleFormPurpose.UPDATE}
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
          purpose={ArticleFormPurpose.UPDATE}
          onSubmit={onSubmitMock}
        />
      </Router>,
    )

    const createButton = screen.getByRole('button', { name: 'UPDATE' })
    expect(createButton).toBeInTheDocument()
    const saveDraftButton = screen.queryByRole('button', { name: 'SAVE DRAFT' })
    expect(saveDraftButton).not.toBeInTheDocument()
  })
})

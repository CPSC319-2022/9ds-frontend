import { render, screen } from '@testing-library/react'
import { TextEditor } from '../../components/TextEditor'

describe('TextEditor', () => {
  beforeAll(() => {
    render(<TextEditor />)
    jest.setTimeout(15000)
  })

  test('style/components', () => {
    const title = screen.getByText('Body')
    expect(title).toBeInTheDocument()
    const [boldImg, italicImg, underlineImg] = screen.getAllByRole('img')
    expect(boldImg).toHaveAttribute('src', 'bold.svg')
    expect(boldImg).toBeInTheDocument()
    expect(italicImg).toHaveAttribute('src', 'italic.svg')
    expect(italicImg).toBeInTheDocument()
    expect(underlineImg).toHaveAttribute('src', 'underline.svg')
    expect(underlineImg).toBeInTheDocument()
    const editor = screen.getByLabelText('rdw-editor')
    expect(editor).toHaveStyle(
      'outline: none; user-select: text; white-space: pre-wrap; word-wrap: break-word;',
    )
    expect(editor).toBeInTheDocument()
  })
})

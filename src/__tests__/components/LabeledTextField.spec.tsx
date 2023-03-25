import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LabeledTextField } from '../../components/LabeledTextField'

describe('LabeledTextField', () => {
  it('renders the component with the correct label and text', () => {
    render(<LabeledTextField labelWidth={2} text='Name:' />)
    const label = screen.getByText('Name:')
    expect(label).toBeInTheDocument()
    const textField = screen.getByRole('textbox')
    expect(textField).toBeInTheDocument()
  })

  it('renders the component with the correct value', () => {
    render(<LabeledTextField labelWidth={2} text='Name:' value='John' />)
    const textField = screen.getByRole('textbox')
    expect(textField).toHaveValue('John')
  })

  it('calls the onTextChange function when the input is changed', () => {
    const handleChange = jest.fn()
    render(
      <LabeledTextField
        labelWidth={2}
        text='Name:'
        onTextChange={handleChange}
      />,
    )
    const textField = screen.getByRole('textbox')
    userEvent.type(textField, 'John')
    expect(handleChange).toHaveBeenCalledWith('John')
  })

  it('renders the component with the correct variant', () => {
    render(<LabeledTextField labelWidth={2} text='Name:' variant='outlined' />)
    const textField = screen.getByRole('textbox')
    expect(textField).toHaveClass('MuiOutlinedInput-input')
  })

  it('renders the component with the correct number of rows', () => {
    render(<LabeledTextField labelWidth={2} text='Name:' multiline rows={3} />)
    const textField = screen.getByRole('textbox')
    expect(textField).toHaveAttribute('rows', '3')
  })

  it('renders the component with the correct error state', () => {
    render(
      <LabeledTextField
        labelWidth={2}
        text='Name:'
        error
        helperText='Name is required'
      />,
    )
    const errorText = screen.getByText('Name is required')
    expect(errorText).toBeInTheDocument()
  })
})

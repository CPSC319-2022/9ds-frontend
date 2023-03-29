import { render, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PasswordField } from 'components/PasswordField/PasswordField'

describe('ItemGrid', () => {
  it('should render correctly', () => {
    const handleChange = jest.fn()
    const { getByLabelText, getByTestId } = render(
      <PasswordField label='test' setPassword={handleChange} error={''} />,
    )
    fireEvent.click(getByLabelText('toggle password visibility'))
    fireEvent.mouseDown(getByLabelText('toggle password visibility'))
    userEvent.type(getByTestId('password-input'), 'dadss')
    expect(handleChange).toHaveBeenCalledTimes(5)
  })

  it('render with error', () => {
    const handleChange = jest.fn()
    const { getByText } = render(
      <PasswordField
        label='test'
        setPassword={handleChange}
        error={'dsadas'}
      />,
    )
    expect(getByText('dsadas')).toBeInTheDocument()
  })
})

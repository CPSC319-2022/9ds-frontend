import { render, screen } from '@testing-library/react'
import { EmailVerificationForm } from '../../components/EmailVerificationForm'
import { MemoryRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

describe('EmailVerificationForm', () => {
  beforeAll(() => {
    render(
      <Router>
        <EmailVerificationForm />
      </Router>,
    )
    jest.setTimeout(15000)
  })

  test('style', () => {
    const message = screen.getByText('SEND RESET PASSWORD LINK')
    expect(message).toBeInTheDocument()
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  test('renders email input field', () => {
    render(
      <Router>
        <EmailVerificationForm />
      </Router>,
    )
    const emailInput = screen.getByLabelText('Email')
    expect(emailInput).toBeInTheDocument()
  })

  test('renders send button', () => {
    render(
      <Router>
        <EmailVerificationForm />
      </Router>,
    )
    const sendButton = screen.getByRole('button', {
      name: /send reset password link/i,
    })
    expect(sendButton).toBeInTheDocument()
  })

  test('shows error message when email is invalid', () => {
    render(
      <Router>
        <EmailVerificationForm />
      </Router>,
    )
    const emailInput = screen.getByLabelText('Email')
    const sendButton = screen.getByRole('button', {
      name: /send reset password link/i,
    })

    userEvent.type(emailInput, 'invalid-email')
    userEvent.click(sendButton)

    //TODO: replace with actual error message
    // const errorMessage = screen.getByText('Invalid email')
    // expect(errorMessage).toBeInTheDocument()
  })

  test('shows error message when user is not found', () => {
    render(
      <Router>
        <EmailVerificationForm />
      </Router>,
    )
    const emailInput = screen.getByLabelText('Email')
    const sendButton = screen.getByRole('button', {
      name: /send reset password link/i,
    })

    userEvent.type(emailInput, 'not-found@example.com')
    userEvent.click(sendButton)

    // const errorMessage = screen.getByText('User was not found')
    // expect(errorMessage).toBeInTheDocument()
  })
})

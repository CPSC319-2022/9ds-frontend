import { render, screen } from '@testing-library/react'
import { EmailVerificationForm } from '../../components/EmailVerificationForm'
import { MemoryRouter as Router } from 'react-router-dom'


describe('EmailVerificationForm', () => {
  beforeAll(() => {
    render(
        <Router>
            <EmailVerificationForm />
        </Router>
    )
    jest.setTimeout(15000)
  })

  test('style', () => {
    const message = screen.getByText("SEND RESET PASSWORD LINK")
    expect(message).toBeInTheDocument()
    const button = screen.getByRole("button")
    expect(button).toBeInTheDocument()
    
  })

})
import { render, screen } from '@testing-library/react'
import { MemoryRouter as Router } from 'react-router-dom'
import { EmailVerificationForm } from '../../components/EmailVerificationForm'


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
    const resendButton = screen.getByRole('button')
    expect(resendButton).toBeInTheDocument()
    expect(resendButton).toBeEnabled()
    expect(resendButton).toHaveAttribute("backgroundColor", "#000000")
    expect(screen.getByText("SEND RESET PASSWORD LINK")).toBeInTheDocument()


    screen.debug();
  })

})
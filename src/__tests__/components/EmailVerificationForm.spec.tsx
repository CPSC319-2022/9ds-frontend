import { render, screen } from '@testing-library/react'
import { MemoryRouter as Router } from 'react-router-dom'
import { EmailVerificationForm } from '../../components/ResetPassword'


describe('Footer Styling', () => {
  beforeAll(() => {
    render(
      <Router>
        <EmailVerificationForm />
      </Router>,
    )
    jest.setTimeout(15000)
  })

  test('style', () => {
    screen.debug();
  })

})
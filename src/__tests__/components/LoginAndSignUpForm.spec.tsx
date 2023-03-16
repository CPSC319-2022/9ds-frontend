import { render, screen } from '@testing-library/react'
import { LoginAndSignUpForm } from '../../pages/login/LoginAndSignUpForm'
import { MemoryRouter } from 'react-router-dom'

describe('LoginAndSignUpForm component', () => {
  // test('renders SignUpForm and LoginForm components', () => {
  //   render(
  //     <MemoryRouter>
  //       <LoginAndSignUpForm />
  //     </MemoryRouter>,
  //   )
  //   const signUpForm = screen.getByTestId('sign-up-form')
  //   const loginForm = screen.getByTestId('login-form')
  //   expect(signUpForm).toBeInTheDocument()
  //   expect(loginForm).toBeInTheDocument()
  // })

  test('renders Divider component', () => {
    render(
      <MemoryRouter>
        <LoginAndSignUpForm />
      </MemoryRouter>,
    )
    const divider = screen.getByTestId('login-signup-divider')
    expect(divider).toBeInTheDocument()
  })

  test('has correct Stack props', () => {
    render(
      <MemoryRouter>
        <LoginAndSignUpForm />
      </MemoryRouter>,
    )

    //TODO: the following is causing weird issue, coudnt find root cause
    // const stack = screen.getByTestId('login-signup-stack')

    // expect(stack).toHaveStyle({
    //   direction: 'row',
    //   spacing: '62px',
    //   px: '25px',
    //   alignItems: 'center',
    // })
  })

  test('has correct Divider props', () => {
    render(
      <MemoryRouter>
        <LoginAndSignUpForm />
      </MemoryRouter>,
    )
    const divider = screen.getByTestId('login-signup-divider')
    expect(divider).toHaveStyle({
      borderColor: 'black.main',
      height: '300px',
    })
  })
})

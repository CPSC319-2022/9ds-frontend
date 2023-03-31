import { fireEvent, render, screen } from '@testing-library/react'
import { EmailVerificationForm } from '../../components/EmailVerificationForm'
import { MemoryRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { useForgotPasswordEmail } from '../../hooks/firebase/useAuth'

// describe('EmailVerificationForm', () => {
//   beforeAll(() => {
//     render(
//       <Router>
//         <EmailVerificationForm />
//       </Router>,
//     )
//     jest.setTimeout(15000)
//   })

//   test('style', () => {
//     const message = screen.getByText('SEND RESET PASSWORD LINK')
//     expect(message).toBeInTheDocument()
//     const button = screen.getByRole('button')
//     expect(button).toBeInTheDocument()
//   })

//   test('renders email input field', () => {
//     render(
//       <Router>
//         <EmailVerificationForm />
//       </Router>,
//     )
//     const emailInput = screen.getByLabelText('Email')
//     expect(emailInput).toBeInTheDocument()
//   })

//   test('renders send button', () => {
//     render(
//       <Router>
//         <EmailVerificationForm />
//       </Router>,
//     )
//     const sendButton = screen.getByRole('button', {
//       name: /send reset password link/i,
//     })
//     expect(sendButton).toBeInTheDocument()
//   })

//   test('shows error message when email is invalid', () => {
//     render(
//       <Router>
//         <EmailVerificationForm />
//       </Router>,
//     )
//     const emailInput = screen.getByLabelText('Email')
//     const sendButton = screen.getByRole('button', {
//       name: /send reset password link/i,
//     })

//     userEvent.type(emailInput, 'invalid-email')
//     userEvent.click(sendButton)

//     //TODO: replace with actual error message
//     // const errorMessage = screen.getByText('Invalid email')
//     // expect(errorMessage).toBeInTheDocument()
//   })

//   test('shows error message when user is not found', () => {
//     render(
//       <Router>
//         <EmailVerificationForm />
//       </Router>,
//     )
//     const emailInput = screen.getByLabelText('Email')
//     const sendButton = screen.getByRole('button', {
//       name: /send reset password link/i,
//     })

//     userEvent.type(emailInput, 'not-found@example.com')
//     userEvent.click(sendButton)

//     // const errorMessage = screen.getByText('User was not found')
//     // expect(errorMessage).toBeInTheDocument()
//   })
// })

describe('EmailVerificationForm', () => {
//   jest.mock('react', () => ({
//     ...jest.requireActual('react'),
//     useState: ["test", jest.fn()],
//   }))
// const mockedUsedNavigate = jest.fn()
// jest.mock('react-router-dom', () => ({
//   ...(jest.requireActual('react-router-dom') as any),
//   useNavigate: () => mockedUsedNavigate,
// }))
// const mockError = {code: "test"}
// const mockLoading = false
// const mockSendEmail = jest.fn()
// jest.mock('../../hooks/firebase/useAuth', () => ({
//   ...(jest.requireActual('../../hooks/firebase/useAuth') as any),
//   useForgotPasswordEmail: () => {sendEmail: mockSendEmail},
// }))
const mockSendEmail = jest.fn()
// const x = jest.fn().mockReturnValue({sendEmail: mockSendEmail, error: {code: null}, loading: false})
jest.mock('../../hooks/firebase/useAuth', () => ({
    ...(jest.requireActual('../../hooks/firebase/useAuth') as any),
    useForgotPasswordEmail: () => mockSendEmail
}))
// const mockNavigate = jest.fn()
// jest.mock('react-router-dom', () => ({
//     useNavigate: () => mockNavigate,
// }))
test.only('navigates to get-started page if email sent successfully', () => {
    const x = jest.fn(() => console.log("helloooooo"))
    mockSendEmail.mockReturnValue({
        sendEmail: x,
        error: {code: null},
        loading: false
    })
    render(<Router><EmailVerificationForm /></Router>)
    // const emailInput = screen.getByLabelText('Email')
    // userEvent.type(emailInput, 'invalid-email')
    const sendButton = screen.getByText('SEND RESET PASSWORD LINK')
    userEvent.click(sendButton)
    expect(mockSendEmail).toBeCalled()
    expect(x).toBeCalledWith("")
    
  })


  test('Error seen', () => {

    // render(
    //   <Router>
    //     <EmailVerificationForm />
    //   </Router>,
    // )
    // const sendButton = screen.getByRole('button', {
    //           name: /send reset password link/i,
    //         })
    // fireEvent.click(sendButton)
    // // expect(mockSendEmail).toHaveBeenCalled()
    // screen.debug()
    
  })
})

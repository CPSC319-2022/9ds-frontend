// TODO: Need to get this test case working
// import { render, screen } from '@testing-library/react'
// import { MemoryRouter as Router } from 'react-router-dom'
// import { EmailVerificationForm } from "../../components/EmailVerificationForm"

// describe('EmailVerificationForm', () => {
//     const mockSendEmail = jest.fn()
//     const mockError = ""
//     const mockLoading = false

//   beforeAll(() => {
//     jest.mock("../../hooks/firebase/useAuth/useForgotPasswordEmail", () => {
//         return {sendEmail: mockSendEmail, error: mockError, loading: mockLoading}
//     })
//     render(
//         <EmailVerificationForm />
//     )
//     jest.setTimeout(15000)
//   })

//   test('style', () => {
//     screen.debug()
//   })
// })
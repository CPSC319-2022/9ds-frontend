import {fireEvent, render, screen} from '@testing-library/react'
import {EmailVerificationForm} from '../../components/EmailVerificationForm'
import {MemoryRouter as Router} from 'react-router-dom'
import React from 'react'
import {useForgotPasswordEmail} from '../../hooks/firebase/useAuth'

jest.mock('../../hooks/firebase/useAuth', () => ({
  ...jest.requireActual('../../hooks/firebase/useAuth'),
  useForgotPasswordEmail: jest.fn(),
}))

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as any),
    useNavigate: () => mockNavigate,
  }))

const mockSendEmail = jest.fn()

describe('EmailVerificationForm', () => {
  beforeEach(() => {
    jest.resetModules();
    useForgotPasswordEmail.mockReturnValue({
      sendEmail: jest.fn(),
      error: {code: ''},
      loading: false
    })
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('style', () => {
    render(
      <Router>
        <EmailVerificationForm/>
      </Router>
    );
    const message = screen.getByText('SEND RESET PASSWORD LINK');
    expect(message).toBeInTheDocument();
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  })

  test('renders email input field', () => {
    render(
      <Router>
        <EmailVerificationForm/>
      </Router>
    );
    const emailInput = screen.getByLabelText('Email')
    expect(emailInput).toBeInTheDocument();
  })

  test('renders send button', () => {
    render(
      <Router>
        <EmailVerificationForm/>
      </Router>
    );
    const sendButton = screen.getByRole('button', {
      name: /send reset password link/i,
    });
    expect(sendButton).toBeInTheDocument();
  });

  test('shows error message when email is invalid', () => {
    useForgotPasswordEmail.mockReturnValue({
          sendEmail: mockSendEmail,
          error: {code: 'auth/invalid-email'},
          loading: true
    })
    render(
      <Router>
        <EmailVerificationForm/>
      </Router>,
    )
    const emailInput = screen.getByLabelText('Email')
    fireEvent.change(emailInput, {target: {value: 'invalid-email'}});
    const sendButton = screen.getByRole('button', {
      name: /send reset password link/i,
    });
    fireEvent.click(sendButton);
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    expect(mockSendEmail).toBeCalled();
  });

  test('shows error message when user not found', () => {
    useForgotPasswordEmail.mockReturnValue({
          sendEmail: mockSendEmail,
          error: {code: 'auth/user-not-found'},
          loading: true
    })
    render(
      <Router>
        <EmailVerificationForm/>
      </Router>,
    )
    const emailInput = screen.getByLabelText('Email')
    fireEvent.change(emailInput, {target: {value: 'dummy@mail.com'}});
    const sendButton = screen.getByRole('button', {
      name: /send reset password link/i,
    });
    fireEvent.click(sendButton);
    expect(screen.getByText(/user was not found/i)).toBeInTheDocument();
    expect(mockSendEmail).toBeCalled();
  });

  test('shows error message when unknown error', () => {
    useForgotPasswordEmail.mockReturnValue({
          sendEmail: mockSendEmail,
          error: {code: 'unknown'},
          loading: true
    })
    render(
      <Router>
        <EmailVerificationForm/>
      </Router>,
    )
    const emailInput = screen.getByLabelText('Email')
    fireEvent.change(emailInput, {target: {value: 'dummy@mail.com'}});
    const sendButton = screen.getByRole('button', {
      name: /send reset password link/i,
    });
    fireEvent.click(sendButton);
    expect(screen.getByText(/unable to send email link/i)).toBeInTheDocument();
    expect(mockSendEmail).toBeCalled();
  });

  test('navigate to login page when success', () => {
    useForgotPasswordEmail.mockReturnValue({
          sendEmail: mockSendEmail,
          error: {code: 'unknown'},
          loading: false
    })
    render(
      <Router>
        <EmailVerificationForm/>
      </Router>,
    )
    expect(mockNavigate).toBeCalledWith('/get-started');
  });

});

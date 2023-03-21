import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { Header, UserRole } from '../../components/Header/Header'

describe('Header As Contributor', () => {
  const mockedUsedNavigate = jest.fn()
  const mockSignOutWrapper = jest.fn()

  jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as any),
    useNavigate: () => mockedUsedNavigate,
  }))

  jest.mock('../../hooks/firebase/useAuth', () => ({
    ...(jest.requireActual('../../hooks/firebase/useAuth') as any),
    useSignOut: () => {signOutWrapper: mockSignOutWrapper},
  }))
  beforeEach(async () => {
   await act( async() => render(
      <Router>
        <Header role={UserRole.CONTRIBUTOR} />
      </Router>,
    )
   )
    jest.setTimeout(15000)
  })

  test('style/components', () => {
    const logo = screen.getByTestId('logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', 'logo.png')
    expect(logo).toHaveAttribute('width', '100px')
    expect(logo).toHaveAttribute('height', '50px')

    const signOut = screen.getByText('SIGN OUT')
    expect(signOut).toBeInTheDocument()

    const home = screen.getByText('HOME')
    expect(home).toBeInTheDocument()

    const blog = screen.getByText('BLOG')
    expect(blog).toBeInTheDocument()

    const aboutUs = screen.getByText('ABOUT US')
    expect(aboutUs).toBeInTheDocument()
  })

  test('see menu', () => {
    const blogBtn = screen.getByTestId('blog-button')
    userEvent.click(blogBtn)

    const blog = screen.getByText('CREATE BLOG POST')
    expect(blog).toBeInTheDocument()

    const profile = screen.getByText('PROFILE')
    expect(profile).toBeInTheDocument()
  })

  test('click menu', () => {
    const blogBtn = screen.getByTestId('blog-button')
    userEvent.click(blogBtn)


    const blog = screen.getByText('CREATE BLOG POST')
    const profile = screen.getByText('PROFILE')
    userEvent.click(blog)

    userEvent.click(blogBtn)
    userEvent.click(profile)
  })

  test('menu close', () => {
    const blogBtn = screen.getByTestId('blog-button')
    userEvent.click(blogBtn)
    userEvent.click(blogBtn)
  })

  test('sign out', async () => {
    const signOutBtn = screen.getByTestId('sign-out-btn')
    await act( async () => userEvent.click(signOutBtn))
  })
})

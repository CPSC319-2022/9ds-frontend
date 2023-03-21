import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { HeaderAsAdmin } from '../../components/Header/HeaderAsAdmin'
import { HeaderAsContributor } from '../../components/Header/HeaderAsContributor'

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
    await act( () => render(
      <Router>
        <HeaderAsAdmin />
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

    const admin = screen.getByText('ADMIN PANEL')
    expect(admin).toBeInTheDocument()
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

    const blog = screen.getByTestId('create-menu')
    userEvent.click(blog)

    userEvent.click(blogBtn)

    const profile = screen.getByTestId("profile")
    userEvent.click(profile)
  })

  test('menu close', () => {
    const blogBtn = screen.getByTestId('blog-button')
    userEvent.click(blogBtn)
    userEvent.click(blogBtn)
  })

  test('sign out', () => {
    const signOutBtn = screen.getByTestId('sign-out-btn')
    userEvent.click(signOutBtn)
  })
})
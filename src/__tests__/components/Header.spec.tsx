import { render, screen } from '@testing-library/react'
import React from 'react'
import { Header } from '../../components/Header'

describe('Header Styling', () => {
  beforeAll(() => {
    render(<Header />)
    jest.setTimeout(15000);
  })

  test('style', () => {
    const logo = screen.getByRole('img')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', 'logo.png')
    expect(logo).toHaveAttribute('width', '100px')
    expect(logo).toHaveAttribute('height', '50px')

    const homeHeading = screen.getByText('Home')
    expect(homeHeading).toBeInTheDocument()
    expect(homeHeading).toHaveClass(
      'MuiTypography-root MuiTypography-subheading css-37jdci-MuiTypography-root',
    )

    const blogHeading = screen.getByText('Blog')
    expect(blogHeading).toBeInTheDocument()
    expect(blogHeading).toHaveClass(
      'MuiTypography-root MuiTypography-subheading css-37jdci-MuiTypography-root',
    )

    const aboutUsHeading = screen.getByText('About Us')
    expect(aboutUsHeading).toBeInTheDocument()
    expect(aboutUsHeading).toHaveClass(
      'MuiTypography-root MuiTypography-subheading css-37jdci-MuiTypography-root',
    )

    const [loginButton, signUpButton] = screen.getAllByRole('button')

    expect(signUpButton).toBeInTheDocument()
    expect(signUpButton).toBeEnabled()
    expect(signUpButton).toHaveClass(
      'MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeLarge MuiButton-containedSizeLarge MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeLarge MuiButton-containedSizeLarge css-1clz53t-MuiButtonBase-root-MuiButton-root',
    )
    expect(signUpButton).toContainElement(screen.getByText('Sign up'))
    expect(screen.getByText('Sign up')).toHaveClass(
      'MuiTypography-root MuiTypography-button MuiTypography-noWrap css-17bkmi9-MuiTypography-root',
    )

    expect(loginButton).toBeInTheDocument()
    expect(loginButton).toBeEnabled()
    expect(loginButton).toHaveClass(
      'MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-sizeLarge MuiButton-outlinedSizeLarge MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-sizeLarge MuiButton-outlinedSizeLarge css-7t08c-MuiButtonBase-root-MuiButton-root',
    )
    expect(loginButton).toContainElement(screen.getByText('Login'))
    expect(screen.getByText('Login')).toHaveClass(
      'MuiTypography-root MuiTypography-button MuiTypography-noWrap css-o6aqg8-MuiTypography-root',
    )
  })
})

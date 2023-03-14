import { render, screen } from '@testing-library/react'
import { MemoryRouter as Router } from 'react-router-dom'
import { Header } from '../../components/Header'

describe('Header Styling', () => {
  beforeAll(() => {
    render(
      <Router>
        <Header />
      </Router>,
    )
    jest.setTimeout(15000)
  })

  test('style', () => {
    const logo = screen.getByRole('img')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', 'logo.png')
    expect(logo).toHaveAttribute('width', '100px')
    expect(logo).toHaveAttribute('height', '50px')

    const homeHeading = screen.getByText('HOME')
    expect(homeHeading).toBeInTheDocument()
    expect(homeHeading).toHaveClass(
      'MuiTypography-root MuiTypography-subheading css-1nrr9hi-MuiTypography-root',
    )

    const blogHeading = screen.getByText('BLOG')
    expect(blogHeading).toBeInTheDocument()
    expect(blogHeading).toHaveClass(
      'MuiTypography-root MuiTypography-subheading css-1nrr9hi-MuiTypography-root',
    )

    const aboutUsHeading = screen.getByText('ABOUT US')
    expect(aboutUsHeading).toBeInTheDocument()
    expect(aboutUsHeading).toHaveClass(
      'MuiTypography-root MuiTypography-subheading css-1nrr9hi-MuiTypography-root',
    )

    const [loginAndSignUpButton] = screen.getAllByRole('button')

    expect(loginAndSignUpButton).toBeInTheDocument()
    expect(loginAndSignUpButton).toBeEnabled()
    expect(loginAndSignUpButton).toHaveClass(
      'MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeLarge MuiButton-containedSizeLarge MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeLarge MuiButton-containedSizeLarge css-1clz53t-MuiButtonBase-root-MuiButton-root',
    )
    expect(loginAndSignUpButton).toContainElement(screen.getByText('LOGIN/SIGN UP'))
    expect(screen.getByText('LOGIN/SIGN UP')).toHaveClass(
      'MuiTypography-root MuiTypography-button MuiTypography-noWrap css-17bkmi9-MuiTypography-root',
    )
  })
})

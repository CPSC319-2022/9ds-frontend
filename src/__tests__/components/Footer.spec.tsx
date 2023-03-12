import { render, screen } from '@testing-library/react'
import { MemoryRouter as Router } from 'react-router-dom'
import { Footer } from '../../components/Footer'

describe('Footer Styling', () => {
  beforeAll(() => {
    render(
      <Router>
        <Footer />
      </Router>,
    )
    jest.setTimeout(15000)
  })

  test('style', () => {
    const [feather, logo] = screen.getAllByRole('img')
    expect(feather).toBeInTheDocument()
    expect(feather).toHaveAttribute('src', 'feather.png')
    expect(feather).toHaveAttribute('height', '60rem')
    expect(feather).toHaveAttribute('width', '80rem')

    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', 'logo.png')
    expect(logo).toHaveAttribute('height', '35rem')
    expect(logo).toHaveAttribute('width', '60rem')

    const getStartedButton = screen.getByRole('button')
    expect(getStartedButton).toBeInTheDocument()
    expect(getStartedButton).toBeEnabled()
    expect(getStartedButton).toContainElement(screen.getByText('Get started'))
    expect(screen.getByText('Get started')).toBeInTheDocument()

    const homeCaption = screen.getByText('Home')
    expect(homeCaption).toBeInTheDocument()

    const aboutUsCaption = screen.getByText('About Us')
    expect(aboutUsCaption).toBeInTheDocument()

    const blogCaption = screen.getByText('Blog')
    expect(blogCaption).toBeInTheDocument()

    const copyright = screen.getByText('@2023')
    expect(copyright).toBeInTheDocument()

    const callToAction = screen.getByText('Start by writing something simple')
    expect(callToAction).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import React from 'react'
import { Footer } from '../../components/Footer'

describe('Footer Styling', () => {
  beforeAll(() => {
    render(<Footer />)
    jest.setTimeout(15000);
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
    expect(screen.getByText('Get started')).toHaveClass(
      'MuiTypography-root MuiTypography-button MuiTypography-noWrap css-17bkmi9-MuiTypography-root',
    )

    const homeCaption = screen.getByText('Home')
    expect(homeCaption).toBeInTheDocument()
    expect(homeCaption).toHaveClass(
      'MuiTypography-root MuiTypography-caption css-l9xrju-MuiTypography-root',
    )

    const aboutUsCaption = screen.getByText('About Us')
    expect(aboutUsCaption).toBeInTheDocument()
    expect(aboutUsCaption).toHaveClass(
      'MuiTypography-root MuiTypography-caption css-l9xrju-MuiTypography-root',
    )

    const blogCaption = screen.getByText('Blog')
    expect(blogCaption).toBeInTheDocument()
    expect(blogCaption).toHaveClass(
      'MuiTypography-root MuiTypography-caption css-l9xrju-MuiTypography-root',
    )

    const copyright = screen.getByText('@2023')
    expect(copyright).toBeInTheDocument()
    expect(copyright).toHaveClass(
      'MuiTypography-root MuiTypography-small css-19nzuet-MuiTypography-root',
    )

    const callToAction = screen.getByText('Start by writing something simple')
    expect(callToAction).toBeInTheDocument()
    expect(callToAction).toHaveClass(
      'MuiTypography-root MuiTypography-h5 css-1pwh960-MuiTypography-root',
    )
  })
})

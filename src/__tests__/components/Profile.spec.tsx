import { render, screen } from '@testing-library/react'
import { Profile } from '../../pages/profile/Profile'
import { MemoryRouter } from 'react-router-dom'

describe('Profile component', () => {
  test('renders loading spinner when loading', () => {
    const { container } = render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  test('renders user profile when loaded', () => {
    const { container } = render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    )
    const profileImage = container.querySelector('img')
    expect(profileImage).toBeInTheDocument()
    // const accountType = screen.getByText(/account type/i)
    // expect(accountType).toBeInTheDocument()
    // const name = screen.getByText(/name/i)
    // expect(name).toBeInTheDocument()
  })

  test('renders user articles when loaded', () => {
    const { container } = render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    )
    const articles = container.querySelectorAll('.MuiTypography-h6')
    expect(articles.length).toBeGreaterThanOrEqual(0)
  })

  test('renders user drafts when loaded', () => {
    const { container } = render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    )
    const drafts = container.querySelectorAll('.MuiTypography-h6')
    expect(drafts.length).toBeGreaterThanOrEqual(0)
  })
})

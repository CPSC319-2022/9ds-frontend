import { render, screen } from '@testing-library/react'
import { Avatar } from '../../components/Avatar'

describe('Avatar Styling', () => {
  beforeAll(() => {
    render(<Avatar />)
    jest.setTimeout(15000)
  })

  test('style', () => {
    const profileImg = screen.getByRole('img')
    expect(profileImg).toBeInTheDocument()
    expect(profileImg).toHaveAttribute('width', '32px')
    expect(profileImg).toHaveAttribute('height', '32px')
    expect(profileImg).toHaveStyle('border-radius: 50%')

    const avatarName = screen.getByTestId('avatarName')
    expect(avatarName).toBeInTheDocument()
    expect(avatarName).toHaveClass(
      'MuiTypography-root MuiTypography-caption css-l9xrju-MuiTypography-root',
    )

    const avatarDate = screen.getByTestId('avatarDate')
    expect(avatarDate).toBeInTheDocument()
    expect(avatarDate).toHaveClass(
      'MuiTypography-root MuiTypography-small css-19nzuet-MuiTypography-root',
    )
  })
})

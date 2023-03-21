import { render, fireEvent } from '@testing-library/react'
import { Button } from '../../components/Button'


describe('Button', () => {
  it('should render correctly', () => {
    const { getByText } = render(<Button text="Click me!" />)
    expect(getByText('Click me!')).toBeInTheDocument()
  })

  it('should call onClick handler when clicked', () => {
    const handleClick = jest.fn()
    const { getByText } = render(<Button text="Click me!" onClick={handleClick} />)
    fireEvent.click(getByText('Click me!'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should render with correct background color when passed dark=true', () => {
    const { getByText } = render(<Button text="Click me!" dark />)
    expect(getByText('Click me!')).toHaveStyle({ backgroundColor: 'black.main' })
  })

  it('should render with correct text color when passed dark=true and variant="outlined"', () => {
    const { getByText } = render(<Button text="Click me!" dark variant="outlined" />)
    expect(getByText('Click me!')).toHaveStyle({ color: 'black.main' })
  })


  it('should render with startIcon when passed startIcon prop', () => {
    const { getByTestId } = render(<Button text="Click me!" startIcon={<span data-testid="icon" />} />)
    expect(getByTestId('icon')).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { Article } from '../../components/Article'

describe('Article Style', () => {
  test('should be large', () => {
    jest.setTimeout(15000)
    render(<Article size='large' />)
    // This shows a clear view of the DOM that is useful for getting elements
    // screen.debug()

    // If a role is not found, getByRole() can show all the selectable roles
    // in the rendered component
    const largeImage = screen.getByRole('img')
    expect(largeImage).toBeInTheDocument()
    expect(largeImage).toHaveAttribute('src', 'sample.jpg')
    expect(largeImage).toHaveStyle('border-radius: 50%')
  })
  test('should be small', () => {
    jest.setTimeout(15000)
    render(<Article size='small' />)
    // Use index to get the first occurrence of the image
    const smallImage = screen.getAllByRole('img')[0]
    expect(smallImage).toBeInTheDocument()
    expect(smallImage).toHaveAttribute('src', 'sample.jpg')
    expect(smallImage).not.toHaveStyle('border-radius: 50%')
    expect(smallImage).toHaveStyle('border-radius: 12px')
    render(<Article />)
    expect(smallImage).toBeInTheDocument()
    expect(smallImage).toHaveAttribute('src', 'sample.jpg')
    expect(smallImage).not.toHaveStyle('border-radius: 50%')
    expect(smallImage).toHaveStyle('border-radius: 12px')
  })
})

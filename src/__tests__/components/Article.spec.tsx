import { render, screen } from '@testing-library/react'
import { Article } from '../../components/Article'
import { TEST_ARTICLE } from '../../configs/testArticle'

describe('Article Style', () => {
  test('should be large', () => {
    jest.setTimeout(15000)
    render(<Article size='large' article={TEST_ARTICLE} />)
    // This shows a clear view of the DOM that is useful for getting elements
    // screen.debug()

    // If a role is not found, getByRole() can show all the selectable roles
    // in the rendered component
    const root = screen.getByTestId('root')
    expect(root).toBeInTheDocument()
    expect(root).toHaveStyle('background-image: url(sample.jpg)')
    expect(root).toHaveStyle('border-radius: 12px')
  })
  test('should be small', () => {
    jest.setTimeout(15000)
    render(<Article size='small' article={TEST_ARTICLE} />)
    // Use index to get the first occurrence of the image
    const smallImage = screen.getAllByRole('img')[0]
    expect(smallImage).toBeInTheDocument()
    expect(smallImage).toHaveAttribute('src', 'sample.jpg')
    expect(smallImage).not.toHaveStyle('border-radius: 50%')
    expect(smallImage).toHaveStyle('border-radius: 12px')
    render(<Article article={TEST_ARTICLE} />)
    expect(smallImage).toBeInTheDocument()
    expect(smallImage).toHaveAttribute('src', 'sample.jpg')
    expect(smallImage).not.toHaveStyle('border-radius: 50%')
    expect(smallImage).toHaveStyle('border-radius: 12px')
  })
})

import { render, fireEvent } from '@testing-library/react'
import { BlogMenu } from 'components/BlogMenu/BlogMenu'
import { MemoryRouter } from 'react-router-dom'

describe('BlogMenu', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <BlogMenu articleId='' author_uid='' />
      </MemoryRouter>,
    )
    expect(getByTestId('blog-menu')).toBeInTheDocument()
  })
})

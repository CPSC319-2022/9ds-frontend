import { render, screen, fireEvent } from '@testing-library/react'
import {MemoryRouter as Router } from 'react-router-dom'
import { Article } from '../../components/Article'
import { TEST_ARTICLE } from '../../configs/testArticle'

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('Article Style', () => {
  beforeEach(() => {
    mockedUsedNavigate.mockReset();
  });

  test('should be large and navigates to blog article', () => {
    jest.setTimeout(15000)
    render(
      <Router>
        <Article size='large' article={TEST_ARTICLE} />
      </Router>,
    )
    // This shows a clear view of the DOM that is useful for getting elements
    // screen.debug()

    // If a role is not found, getByRole() can show all the selectable roles
    // in the rendered component
    const root = screen.getByTestId('root')
    expect(root).toBeInTheDocument()
    expect(root).toHaveStyle('background-image: url(sample.jpg)')
    expect(root).toHaveStyle('border-radius: 12px')
    const button = screen.getAllByRole('button')[0];
    fireEvent.click(button);
    expect(mockedUsedNavigate).toHaveBeenCalledWith(`/blog/${TEST_ARTICLE.articleId}`);
  })
  test('should be small, not a draft, and navigates to blog article', () => {
    jest.setTimeout(15000)
    render(
      <Router>
        <Article size='small' article={TEST_ARTICLE} />
      </Router>,
    )
    // Use index to get the first occurrence of the image
    const smallImage = screen.getAllByRole('img')[0]
    expect(smallImage).toBeInTheDocument()
    expect(smallImage).toHaveAttribute('src', 'sample.jpg')
    expect(smallImage).not.toHaveStyle('border-radius: 50%')
    expect(smallImage).toHaveStyle('border-radius: 12px')
    let button = screen.getAllByRole('button')[0];
    fireEvent.click(button);
    expect(mockedUsedNavigate).toHaveBeenCalledWith(`/blog/${TEST_ARTICLE.articleId}`);
    render(
      <Router>
        <Article article={TEST_ARTICLE} />
      </Router>,
    )
    expect(smallImage).toBeInTheDocument()
    expect(smallImage).toHaveAttribute('src', 'sample.jpg')
    expect(smallImage).not.toHaveStyle('border-radius: 50%')
    expect(smallImage).toHaveStyle('border-radius: 12px')
    button = screen.getAllByRole('button')[0];
    fireEvent.click(button);
    expect(mockedUsedNavigate).toHaveBeenCalledWith(`/blog/${TEST_ARTICLE.articleId}`);
  })
  test('should be a draft and navigates there', () => {
    render(
      <Router>
        <Article size='small' article={TEST_ARTICLE} isDraft/>
      </Router>,
    )
    const button = screen.getAllByRole('button')[0];
    fireEvent.click(button);
    expect(mockedUsedNavigate).toHaveBeenCalledWith(`/draft/${TEST_ARTICLE.articleId}`);
  })
})

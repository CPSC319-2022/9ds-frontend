import {render, fireEvent, act, screen} from '@testing-library/react'
import {BlogMenu} from 'components/BlogMenu/BlogMenu'
import {MemoryRouter} from 'react-router-dom'
import {useUser} from '../../hooks/firebase/useUser'

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('../../hooks/firebase/useUser', () => ({
  ...jest.requireActual('../../hooks/firebase/useUser'),
  useUser: jest.fn(),
}));

describe('BlogMenu', () => {
  const articleId = 'test-article-id'
  const author_uid = '123'

  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly as author', async () => {
    useUser.mockReturnValue({queriedUser: {uid: '123', role: 'contributor'}});
    await act(async () =>
      render(
        <MemoryRouter>
          <BlogMenu articleId={articleId} author_uid={author_uid}/>
        </MemoryRouter>,
      )
    );
    expect(screen.getByTestId('blog-menu')).toBeInTheDocument();
  });

  it('should render correctly as admin', async () => {
    useUser.mockReturnValue({queriedUser: {uid: '456', role: 'admin'}});
    await act(async () =>
      render(
        <MemoryRouter>
          <BlogMenu articleId={articleId} author_uid={author_uid}/>
        </MemoryRouter>,
      )
    );
    expect(screen.getByTestId('blog-menu')).toBeInTheDocument();
  });

  it('does not render for non-authors or admins (showMenu is false)', async () => {
    useUser.mockReturnValue({queriedUser: {uid: '456', role: 'contributor'}});
    await act(async () =>
      render(
        <MemoryRouter>
          <BlogMenu articleId={articleId} author_uid={author_uid}/>
        </MemoryRouter>
      )
    );
    expect(screen.queryByTestId('blog-menu')).not.toBeInTheDocument();
  });

  it('opens the popper when the menu button is clicked', async () => {
    useUser.mockReturnValue({queriedUser: {uid: '123', role: 'contributor'}});
    await act(async () =>
      render(
        <MemoryRouter>
          <BlogMenu articleId={articleId} author_uid={author_uid}/>
        </MemoryRouter>
      )
    );
    const menuButton = screen.getByTestId('blog-menu').querySelector('button');
    fireEvent.click(menuButton);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', {name: /edit article/i})).toBeInTheDocument();
    expect(screen.getByRole('menuitem', {name: /delete article/i})).toBeInTheDocument();
  });

  test('closes the menu when edit article is clicked and handles navigation', async () => {
    useUser.mockReturnValue({queriedUser: {uid: '123', role: 'contributor'}});
    await act(async () =>
      render(
        <MemoryRouter>
          <BlogMenu articleId={articleId} author_uid={author_uid}/>
        </MemoryRouter>
      )
    );
    const menuButton = screen.getByTestId('blog-menu').querySelector('button');
    fireEvent.click(menuButton);
    fireEvent.click(screen.getByRole('menuitem', {name: /edit article/i}));
    expect(screen.queryByRole('menuitem', {name: /edit article/i})).toBeNull();
    expect(mockedUsedNavigate).toHaveBeenCalledWith(`/update/${articleId}`);
  });

  test('closes the menu when delete article is clicked and renders delete modal', async () => {
    useUser.mockReturnValue({queriedUser: {uid: '123', role: 'contributor'}});
    await act(async () =>
      render(
        <MemoryRouter>
          <BlogMenu articleId={articleId} author_uid={author_uid}/>
        </MemoryRouter>
      )
    );
    const menuButton = screen.getByTestId('blog-menu').querySelector('button');
    fireEvent.click(menuButton);
    fireEvent.click(screen.getByRole('menuitem', {name: /delete article/i}));
    expect(screen.queryByRole('menuitem', {name: /delete article/i})).toBeNull();
    expect(screen.getByText('Are you sure you want to delete?')).toBeInTheDocument();
  });
});

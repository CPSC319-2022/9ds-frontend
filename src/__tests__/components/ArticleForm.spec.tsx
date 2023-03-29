import {MemoryRouter as Router} from 'react-router-dom'
import {fireEvent, render, screen, act} from '@testing-library/react';
import {ArticleForm, ArticleFormPurpose} from '../../components/ArticleForm';
import {useUser} from '../../hooks/firebase/useUser'

const mockedUsedNavigate = jest.fn();
const onSubmitMock = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('../../hooks/firebase/useUser', () => ({
  ...jest.requireActual('../../hooks/firebase/useUser'),
  useUser: jest.fn(),
}));

const mockArticle = {
  id: 'abc',
  title: 'Test article',
  content: '{"blocks":[{"key":"foo","text":"Hello, World!","type":"unstyled",' +
    '"depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
  header_image: '',
  author_uid: '123',
  created_at: new Date(),
  updated_at: new Date(),
  published: true,
};

const mockArticleWithEmptyBody = {
  id: 'abc',
  title: 'Test article',
  content: '{"blocks":[{"key":"foo","text":"","type":"unstyled",' +
    '"depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
  header_image: '',
  author_uid: '123',
  created_at: new Date(),
  updated_at: new Date(),
  published: true,
};

describe('ArticleForm UPDATE', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('article data as author', async () => {
    useUser.mockReturnValue({queriedUser: {uid: '123', role: 'contributor'}});
    await act(async () => render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.UPDATE}
            onSubmit={onSubmitMock}
            article={mockArticle}
            articleId='hello'
            setLoading={jest.fn()}
          />
        </Router>
      )
    );
    expect(screen.getByPlaceholderText("60 words or less")).toHaveValue(mockArticle.title);
    expect(screen.getByRole('textbox', {name: "editor"})).toHaveTextContent('Hello, World!');
    expect(screen.getByRole('button', {name: /update/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /delete/i})).toBeInTheDocument();
    expect(screen.queryByRole('button', {name: /save draft/i})).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: /update/i}));
    expect(screen.queryByText(/title can't be empty/i)).not.toBeInTheDocument();
    expect(onSubmitMock).toHaveBeenCalled();
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/profile');
  });

  test('article data as admin', async () => {
    useUser.mockReturnValue({queriedUser: {uid: '567', role: 'admin'}});
    await act(async () => render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.UPDATE}
            onSubmit={onSubmitMock}
            article={mockArticle}
            articleId='hello'
            setLoading={jest.fn()}
          />
        </Router>
      )
    );
    expect(screen.getByPlaceholderText("60 words or less")).toHaveValue(mockArticle.title);
    expect(screen.getByRole('textbox', {name: "editor"})).toHaveTextContent('Hello, World!');
    expect(screen.getByRole('button', {name: /update/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /delete/i})).toBeInTheDocument();
    expect(screen.queryByRole('button', {name: /save draft/i})).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: /update/i}));
    expect(screen.queryByText(/title can't be empty/i)).not.toBeInTheDocument();
    expect(onSubmitMock).toHaveBeenCalled();
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/profile');
  });

  test('article data as contributor who is not author', async () => {
    useUser.mockReturnValue({queriedUser: {uid: '567', role: 'contributor'}});
    await act(async () => render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.UPDATE}
            onSubmit={onSubmitMock}
            article={mockArticle}
            articleId='hello'
            setLoading={jest.fn()}
          />
        </Router>
      )
    );
    expect(screen.getByPlaceholderText("60 words or less")).toHaveValue(mockArticle.title);
    expect(screen.getByRole('textbox', {name: "editor"})).toHaveTextContent('Hello, World!');
    expect(screen.queryByRole('button', {name: /update/i})).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: /delete/i})).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: /save draft/i})).not.toBeInTheDocument();
  });

  test('should display error message when title is changed to empty', async () => {
    useUser.mockReturnValue({queriedUser: {uid: '123', role: 'contributor'}});
    await act(async () => render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.UPDATE}
            onSubmit={onSubmitMock}
            article={mockArticle}
            articleId='hello'
            setLoading={jest.fn()}
          />
        </Router>
      )
    );
    fireEvent.change(screen.getByPlaceholderText("60 words or less"), {
      target: {
        value: ''
      },
    });
    fireEvent.click(screen.getByRole('button', {name: /update/i}));
    expect(screen.getByText(/title can't be empty/i)).toBeInTheDocument();
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  test('should display error message when title is changed to too long', async () => {
    useUser.mockReturnValue({queriedUser: {uid: '123', role: 'contributor'}});
    await act(async () => render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.UPDATE}
            onSubmit={onSubmitMock}
            article={mockArticle}
            articleId='hello'
            setLoading={jest.fn()}
          />
        </Router>
      )
    );
    fireEvent.change(screen.getByPlaceholderText("60 words or less"), {
      target: {
        value: 'From Gutenberg to Google: A Comprehensive Analysis of the Evolution of Communication ' +
          'Technologies and their Societal Impacts on Language, Culture, and Knowledge Acquisition in the ' +
          'Digital Age of Big Data, Artificial Intelligence, Internet of Things, Blockchain, and Quantum ' +
          'Computing. Unraveling the Complexities of the Human Brain and its Implications for Advancements ' +
          'in Neuroscience and Artificial Intelligence: Multi-disciplinary Exploration of Cognitive Computing.'
      },
    });
    fireEvent.click(screen.getByRole('button', {name: /update/i}));
    expect(screen.getByText(/title must be 60 words or less/i)).toBeInTheDocument();
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  test('should display error message when body is changed to empty', async () => {
    useUser.mockReturnValue({queriedUser: {uid: '123', role: 'contributor'}});
    await act(async () => render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.UPDATE}
            onSubmit={onSubmitMock}
            article={mockArticleWithEmptyBody}
            articleId='hello'
            setLoading={jest.fn()}
          />
        </Router>
      )
    );
    fireEvent.click(screen.getByRole('button', {name: /update/i}));
    expect(screen.getByText(/body can't be empty/i)).toBeInTheDocument();
    expect(onSubmitMock).not.toHaveBeenCalled();
  });
});

describe('ArticleForm CREATE/DRAFT', () => {
  beforeEach(() => {
    useUser.mockReturnValue({queriedUser: {role: 'contributor'}});
    jest.resetModules();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render create form', async () => {
    await act(async () => render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.CREATE}
            onSubmit={onSubmitMock}
            article={mockArticle}
            setLoading={jest.fn()}
          />
        </Router>
      )
    );
    expect(screen.getByText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/body/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /create/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /save draft/i})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: /create/i}));
    expect(screen.queryByText(/title can't be empty/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/title must be 60 words or less/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/body can't be empty/i)).not.toBeInTheDocument();
    expect(onSubmitMock).toHaveBeenCalled();
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/profile');
  });

  test('should render draft form', async () => {
    await act(async () => render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.DRAFT}
            onSubmit={onSubmitMock}
            article={mockArticle}
            setLoading={jest.fn()}
          />
        </Router>
      )
    );
    expect(screen.getByText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/body/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /create/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /save draft/i})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: /create/i}));
    expect(screen.queryByText(/title can't be empty/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/title must be 60 words or less/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/body can't be empty/i)).not.toBeInTheDocument();
    expect(onSubmitMock).toHaveBeenCalled();
  });

  test('should display error message when title is empty', async () => {
    await act(async () => render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.CREATE}
            onSubmit={onSubmitMock}
            setLoading={jest.fn()}
          />
        </Router>
      )
    );
    fireEvent.click(screen.getByRole('button', {name: /create/i}));
    expect(screen.getByText(/title can't be empty/i)).toBeInTheDocument();
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  test('should display error message when title is too long', async () => {
    await act(async () => render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.CREATE}
            onSubmit={onSubmitMock}
            setLoading={jest.fn()}
          />
        </Router>
      )
    );
    fireEvent.change(screen.getByPlaceholderText("60 words or less"), {
      target: {
        value: 'From Gutenberg to Google: A Comprehensive Analysis of the Evolution of Communication ' +
          'Technologies and their Societal Impacts on Language, Culture, and Knowledge Acquisition in the ' +
          'Digital Age of Big Data, Artificial Intelligence, Internet of Things, Blockchain, and Quantum ' +
          'Computing. Unraveling the Complexities of the Human Brain and its Implications for Advancements ' +
          'in Neuroscience and Artificial Intelligence: Multi-disciplinary Exploration of Cognitive Computing.'
      },
    });
    fireEvent.click(screen.getByRole('button', {name: /create/i}));
    expect(screen.getByText(/title must be 60 words or less/i)).toBeInTheDocument();
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  test('should display error message when body is empty', async () => {
    await act(async () => render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.CREATE}
            onSubmit={onSubmitMock}
            setLoading={jest.fn()}
          />
        </Router>
      )
    );
    fireEvent.click(screen.getByRole('button', {name: /create/i}));
    expect(screen.getByText(/body can't be empty/i)).toBeInTheDocument();
    expect(onSubmitMock).not.toHaveBeenCalled();
  });
});

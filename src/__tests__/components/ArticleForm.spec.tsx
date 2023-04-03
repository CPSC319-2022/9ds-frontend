import { MemoryRouter as Router } from 'react-router-dom'
import { fireEvent, render, screen, act } from '@testing-library/react'
import { ArticleForm, ArticleFormPurpose } from '../../components/ArticleForm'
import { useUser } from '../../hooks/firebase/useUser'
import profile from '../../assets/profile.png'
import { Timestamp } from 'firebase/firestore'

const mockedUsedNavigate = jest.fn()
const onSubmitMock = jest.fn()
const mockLoading = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}))

jest.mock('../../hooks/firebase/useUser', () => ({
  ...jest.requireActual('../../hooks/firebase/useUser'),
  useUser: jest.fn(),
}))

const mockArticle = {
  title: 'Test article',
  content:
    '{"blocks":[{"key":"foo","text":"Hello, World!","type":"unstyled",' +
    '"depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
  header_image:
    'https://www.camera-rumors.com/wp-content/uploads/2015/01/nikon-d750-sample-images.jpg',
  author_image: 'profile',
  author_uid: '123',
  edit_time: new Timestamp(1, 0),
  author_username: 'Andy',
  publish_time: new Timestamp(60, 0),
}

const mockArticleWithEmptyBody = {
  title: 'Test article',
  content:
    '{"blocks":[{"key":"foo","text":"","type":"unstyled",' +
    '"depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
  header_image:
    'https://www.camera-rumors.com/wp-content/uploads/2015/01/nikon-d750-sample-images.jpg',
  author_image: 'profile',
  author_uid: '123',
  edit_time: new Timestamp(1, 0),
  author_username: 'Andy',
  publish_time: new Timestamp(60, 0),
}

describe('ArticleForm UPDATE', () => {
  beforeEach(() => {
    jest.resetModules()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('article data as author', async () => {
    (useUser as jest.Mock).mockReturnValue({
      queriedUser: { uid: '123', role: 'contributor' },
    })
    await act(async () =>
      render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.UPDATE}
            onSubmit={onSubmitMock}
            article={mockArticle}
            articleId='hello'
            setLoading={mockLoading}
          />
        </Router>,
      ),
    )
    expect(screen.getByPlaceholderText('60 words or less')).toHaveValue(
      mockArticle.title,
    )
    expect(screen.getByRole('textbox', { name: 'editor' })).toHaveTextContent(
      'Hello, World!',
    )
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /save draft/i }),
    ).toBeInTheDocument()
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: /update/i })),
    )
    expect(screen.queryByText(/title can't be empty/i)).not.toBeInTheDocument()
    expect(onSubmitMock).toHaveBeenCalled()
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/profile')
  })

  test('article data as admin', async () => {
    (useUser as jest.Mock).mockReturnValue({
      queriedUser: { uid: '567', role: 'admin' },
    })
    await act(async () =>
      render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.UPDATE}
            onSubmit={onSubmitMock}
            article={mockArticle}
            articleId='hello'
            setLoading={mockLoading}
          />
        </Router>,
      ),
    )
    expect(screen.getByPlaceholderText('60 words or less')).toHaveValue(
      mockArticle.title,
    )
    expect(screen.getByRole('textbox', { name: 'editor' })).toHaveTextContent(
      'Hello, World!',
    )
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /save draft/i }),
    ).toBeInTheDocument()
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: /update/i })),
    )
    expect(screen.queryByText(/title can't be empty/i)).not.toBeInTheDocument()
    expect(onSubmitMock).toHaveBeenCalled()
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/profile')
  })

  test('article data as contributor who is not author', async () => {
    (useUser as jest.Mock).mockReturnValue({
      queriedUser: { uid: '567', role: 'contributor' },
    })
    await act(async () =>
      render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.UPDATE}
            onSubmit={onSubmitMock}
            article={mockArticle}
            articleId='hello'
            setLoading={mockLoading}
          />
        </Router>,
      ),
    )
    expect(screen.getByPlaceholderText('60 words or less')).toHaveValue(
      mockArticle.title,
    )
    expect(screen.getByRole('textbox', { name: 'editor' })).toHaveTextContent(
      'Hello, World!',
    )
    expect(
      screen.queryByRole('button', { name: /update/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /delete/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /save draft/i }),
    ).toBeInTheDocument()
  })

  test('should display error message when title is changed to empty', async () => {
    (useUser as jest.Mock).mockReturnValue({
      queriedUser: { uid: '123', role: 'contributor' },
    })
    await act(async () =>
      render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.UPDATE}
            onSubmit={onSubmitMock}
            article={mockArticle}
            articleId='hello'
            setLoading={mockLoading}
          />
        </Router>,
      ),
    )
    await act(async () =>
      fireEvent.change(screen.getByPlaceholderText('60 words or less'), {
        target: {
          value: '',
        },
      }),
    )
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: /update/i })),
    )
    expect(screen.getByText(/title can't be empty/i)).toBeInTheDocument()
    expect(onSubmitMock).not.toHaveBeenCalled()
  })

  test('should display error message when title is changed to too long', async () => {
    (useUser as jest.Mock).mockReturnValue({
      queriedUser: { uid: '123', role: 'contributor' },
    })
    await act(async () =>
      render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.UPDATE}
            onSubmit={onSubmitMock}
            article={mockArticle}
            articleId='hello'
            setLoading={mockLoading}
          />
        </Router>,
      ),
    )
    await act(async () =>
      fireEvent.change(screen.getByPlaceholderText('60 words or less'), {
        target: {
          value:
            'From Gutenberg to Google: A Comprehensive Analysis of the Evolution of Communication ' +
            'Technologies and their Societal Impacts on Language, Culture, and Knowledge Acquisition in the ' +
            'Digital Age of Big Data, Artificial Intelligence, Internet of Things, Blockchain, and Quantum ' +
            'Computing. Unraveling the Complexities of the Human Brain and its Implications for Advancements ' +
            'in Neuroscience and Artificial Intelligence: Multi-disciplinary Exploration of Cognitive Computing.',
        },
      }),
    )
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: /update/i })),
    )
    expect(
      screen.getByText(/title must be 60 words or less/i),
    ).toBeInTheDocument()
    expect(onSubmitMock).not.toHaveBeenCalled()
  })

  test('should display error message when body is changed to empty', async () => {
    (useUser as jest.Mock).mockReturnValue({
      queriedUser: { uid: '123', role: 'contributor' },
    })
    await act(async () =>
      render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.UPDATE}
            onSubmit={onSubmitMock}
            article={mockArticleWithEmptyBody}
            articleId='hello'
            setLoading={mockLoading}
          />
        </Router>,
      ),
    )
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: /update/i })),
    )
    expect(screen.getByText(/body can't be empty/i)).toBeInTheDocument()
    expect(onSubmitMock).not.toHaveBeenCalled()
  })

  test('should display confirmation modal when delete button is clicked', async () => {
    (useUser as jest.Mock).mockReturnValue({
      queriedUser: { uid: '123', role: 'contributor' },
    })
    await act(async () =>
      render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.UPDATE}
            onSubmit={onSubmitMock}
            article={mockArticle}
            articleId='hello'
            setLoading={mockLoading}
          />
        </Router>,
      ),
    )
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: /delete/i })),
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})

describe('ArticleForm CREATE/DRAFT', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      queriedUser: { role: 'contributor' },
    })
    jest.resetModules()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should render create form', async () => {
    await act(async () =>
      render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.CREATE}
            onSubmit={onSubmitMock}
            article={mockArticle}
            setLoading={mockLoading}
          />
        </Router>,
      ),
    )
    expect(
      screen.getByRole('button', { name: /computer/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /web/i })).toBeInTheDocument()
    expect(screen.getByText(/title/i)).toBeInTheDocument()
    expect(screen.getByText(/body/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /save draft/i }),
    ).toBeInTheDocument()
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: /create/i })),
    )
    expect(screen.queryByText(/title can't be empty/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/title must be 60 words or less/i),
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/body can't be empty/i)).not.toBeInTheDocument()
    expect(onSubmitMock).toHaveBeenCalled()
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/profile')
  })

  test('should render draft form', async () => {
    await act(async () =>
      render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.DRAFT}
            onSubmit={onSubmitMock}
            article={mockArticle}
            setLoading={mockLoading}
          />
        </Router>,
      ),
    )
    expect(screen.getByText(/title/i)).toBeInTheDocument()
    expect(screen.getByText(/body/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /save draft/i }),
    ).toBeInTheDocument()
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: /create/i })),
    )
    expect(screen.queryByText(/title can't be empty/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/title must be 60 words or less/i),
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/body can't be empty/i)).not.toBeInTheDocument()
    expect(onSubmitMock).toHaveBeenCalled()
  })

  test('should display error message when title is empty', async () => {
    await act(async () =>
      render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.CREATE}
            onSubmit={onSubmitMock}
            setLoading={mockLoading}
          />
        </Router>,
      ),
    )
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: /create/i })),
    )
    expect(screen.getByText(/title can't be empty/i)).toBeInTheDocument()
    expect(onSubmitMock).not.toHaveBeenCalled()
  })

  test('should display error message when title is too long', async () => {
    await act(async () =>
      render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.CREATE}
            onSubmit={onSubmitMock}
            setLoading={mockLoading}
          />
        </Router>,
      ),
    )
    await act(async () =>
      fireEvent.change(screen.getByPlaceholderText('60 words or less'), {
        target: {
          value:
            'From Gutenberg to Google: A Comprehensive Analysis of the Evolution of Communication ' +
            'Technologies and their Societal Impacts on Language, Culture, and Knowledge Acquisition in the ' +
            'Digital Age of Big Data, Artificial Intelligence, Internet of Things, Blockchain, and Quantum ' +
            'Computing. Unraveling the Complexities of the Human Brain and its Implications for Advancements ' +
            'in Neuroscience and Artificial Intelligence: Multi-disciplinary Exploration of Cognitive Computing.',
        },
      }),
    )
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: /create/i })),
    )
    expect(
      screen.getByText(/title must be 60 words or less/i),
    ).toBeInTheDocument()
    expect(onSubmitMock).not.toHaveBeenCalled()
  })

  test('should display error message when body is empty', async () => {
    await act(async () =>
      render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.CREATE}
            onSubmit={onSubmitMock}
            setLoading={mockLoading}
          />
        </Router>,
      ),
    )
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: /create/i })),
    )
    expect(screen.getByText(/body can't be empty/i)).toBeInTheDocument()
    expect(onSubmitMock).not.toHaveBeenCalled()
  })

  test('click arrows', async () => {
    await act(async () =>
      render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.CREATE}
            onSubmit={onSubmitMock}
            setLoading={mockLoading}
          />
        </Router>,
      ),
    )
    screen.getAllByLabelText('picture-selection').forEach((element) => {
      expect(element).toBeInTheDocument()
    })
    const rightArrow = screen.getByTestId('right')
    await act(async () => fireEvent.click(rightArrow))
    screen.getAllByLabelText('picture-selection').forEach((element) => {
      expect(element).toBeInTheDocument()
    })
    const leftArrow = screen.getByTestId('left')
    await act(async () => fireEvent.click(leftArrow))
    screen.getAllByLabelText('picture-selection').forEach((element) => {
      expect(element).toBeInTheDocument()
    })
  })

  test('should display "Save Draft" button for an unpublished article', async () => {
    const mockUnpublishedArticle = {
      ...mockArticle,
      published: false,
    }
    await act(async () =>
      render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.CREATE}
            onSubmit={onSubmitMock}
            article={mockUnpublishedArticle}
            articleId='hello'
            setLoading={mockLoading}
          />
        </Router>,
      ),
    )
    expect(
      screen.getByRole('button', { name: /save draft/i }),
    ).toBeInTheDocument()
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: /save draft/i })),
    )
    expect(onSubmitMock).toHaveBeenCalledWith(
      'Test article',
      '{"blocks":[{"key":"foo","text":"Hello, World!","type":"unstyled",' +
        '"depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
      'https://www.camera-rumors.com/wp-content/uploads/2015/01/nikon-d750-sample-images.jpg',
      false,
      'hello',
    )
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/profile')
  })

  it('renders FileUploader component when "Computer" button is clicked', async () => {
    await act(async () =>
      render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.CREATE}
            onSubmit={onSubmitMock}
            setLoading={mockLoading}
          />
        </Router>,
      ),
    )
    const computerButton = screen.getByRole('button', { name: /computer/i })
    await act(async () => fireEvent.click(computerButton))
    expect(screen.getByTestId('upload-input')).toBeInTheDocument()
  })

  it('renders TextField and Typography components when "Web" button is clicked', async () => {
    await act(async () =>
      render(
        <Router>
          <ArticleForm
            purpose={ArticleFormPurpose.CREATE}
            onSubmit={onSubmitMock}
            setLoading={mockLoading}
          />
        </Router>,
      ),
    )
    const webButton = screen.getByRole('button', { name: /web/i })
    await act(async () => fireEvent.click(webButton))
    expect(
      screen.getByPlaceholderText('Paste link to image'),
    ).toBeInTheDocument()
    expect(screen.getByText('Image Not Found')).toBeInTheDocument()
  })
})

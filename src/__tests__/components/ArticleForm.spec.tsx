// import { act, render, screen } from '@testing-library/react'
// import { ArticleForm, ArticleFormPurpose } from '../../components/ArticleForm'
import {MemoryRouter as Router} from 'react-router-dom'
//
// describe('ArticleForm', () => {
//   const onSubmitMock = jest.fn()
//
//   beforeEach(() => {
//     onSubmitMock.mockClear()
//   })
//
//   it('renders title and body text field and custom link field', async () => {
//     await act(async () =>
//       render(
//         <Router>
//           <ArticleForm
//             purpose={ArticleFormPurpose.CREATE}
//             onSubmit={onSubmitMock}
//           />
//         </Router>,
//       ),
//     )
//     const allTextField = screen.getAllByRole('textbox')
//
//     expect(allTextField.length).toBe(3)
//   })
//
//   it('renders publish and save draft buttons', async () => {
//     await act(async () =>
//       render(
//         <Router>
//           <ArticleForm
//             purpose={ArticleFormPurpose.CREATE}
//             onSubmit={onSubmitMock}
//           />
//         </Router>,
//       ),
//     )
//     const publishButton = screen.getByRole('button', { name: 'CREATE' })
//     expect(publishButton).toBeInTheDocument()
//
//     const saveDraftButton = screen.getByRole('button', { name: 'SAVE DRAFT' })
//     expect(saveDraftButton).toBeInTheDocument()
//   })
//
//   it('renders title and body text field and custom link field', async () => {
//     await act(async () =>
//       render(
//         <Router>
//           <ArticleForm
//             purpose={ArticleFormPurpose.UPDATE}
//             onSubmit={onSubmitMock}
//           />
//         </Router>,
//       ),
//     )
//
//     const allTextField = screen.getAllByRole('textbox')
//
//     expect(allTextField.length).toBe(3)
//   })
//
//   it('renders publish and save draft buttons', async () => {
//     await act(async () =>
//       render(
//         <Router>
//           <ArticleForm
//             purpose={ArticleFormPurpose.UPDATE}
//             onSubmit={onSubmitMock}
//           />
//         </Router>,
//       ),
//     )
//
//     const createButton = screen.getByRole('button', { name: 'UPDATE' })
//     expect(createButton).toBeInTheDocument()
//     const saveDraftButton = screen.queryByRole('button', { name: 'SAVE DRAFT' })
//     expect(saveDraftButton).not.toBeInTheDocument()
//   })
// })
import {userEvent, render, screen} from '@testing-library/react';
import {ArticleForm, ArticleFormPurpose} from '../../components/ArticleForm';

describe('ArticleForm', () => {
  const onSubmitMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render create form', () => {
    render(
      <Router>
        <ArticleForm purpose={ArticleFormPurpose.CREATE} onSubmit={onSubmitMock}/>
      </Router>
    );

    expect(screen.getByText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/body/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CREATE' })).toBeInTheDocument();
    expect(screen.getByText(/save draft/i)).toBeInTheDocument();
  });

  test('should render update form with article data', () => {
    const article = {
      id: '1',
      title: 'Test article',
      content: '{"blocks":[],"entityMap":{}}',
      header_image: '',
      author_uid: '2',
      created_at: new Date(),
      updated_at: new Date(),
      published: true,
    };
    render(
      <Router>
        <ArticleForm purpose={ArticleFormPurpose.UPDATE} onSubmit={onSubmitMock} article={article}/>
      </Router>
    );

    expect(screen.getByText(/title/i)).toHaveValue(article.title);
    expect(screen.getByRole('textbox', {name: /body/i})).toHaveTextContent('');
    expect(screen.getByRole('button', {name: /update/i})).toBeInTheDocument();
    expect(screen.getByText(/save draft/i)).toBeInTheDocument();
  });

  test('should display error message when title is empty', () => {
    render(
      <Router>
        <ArticleForm purpose={ArticleFormPurpose.CREATE} onSubmit={onSubmitMock}/>
      </Router>
    );

    userEvent.click(screen.getByRole('button', {name: /publish/i}));
    expect(screen.getByText(/title can't be empty/i)).toBeInTheDocument();
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  test('should display error message when title is too long', () => {
    render(
      <Router>
        <ArticleForm purpose={ArticleFormPurpose.CREATE} onSubmit={onSubmitMock}/>
      </Router>
    );

    userEvent.type(screen.getByRole('textbox', {name: /title/i}), {
      target: {
        value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
          'Vivamus feugiat ullamcorper gravida. ' +
          'Phasellus id urna quis velit suscipit accumsan in eget massa.'
      },
    });
    userEvent.click(screen.getByRole('button', {name: /publish/i}));
    expect(screen.getByText(/title must be 60 words or less/i)).toBeInTheDocument();
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  test('should display error message when body is empty', () => {
    render(
      <Router>
        <ArticleForm purpose={ArticleFormPurpose.CREATE} onSubmit={onSubmitMock}/>
      </Router>
    );

    userEvent.click(screen.getByRole('button', {name: /publish/i}));
    expect(screen.getByText(/body can't be empty/i)).toBeInTheDocument();
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  test('should call onSubmit function when form is submitted', () => {
    render(
      <Router>
        <ArticleForm purpose={ArticleFormPurpose.CREATE} onSubmit={onSubmitMock}/>
      </Router>
    );

    userEvent.type(screen.getByRole('textbox', {name: /title/i}), {
      target: {
        value: 'Lorem ipsum dolor sit amet'
      }
    });
    userEvent.type(screen.getByRole('textbox', {name: /body/i}), {
      target: {
        value: 'Test body'
      }
    });
    userEvent.click(screen.getByRole('button', {name: /publish/i}));
    expect(onSubmitMock).toHaveBeenCalledWith('Test Title', expect.any(String), pictureUrls[0], true);
  });
});

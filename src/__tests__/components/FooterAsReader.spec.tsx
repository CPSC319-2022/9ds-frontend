import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter as Router } from 'react-router-dom'
import { Footer, UserRole } from '../../components/Footer'

describe('Footer Styling', () => {
  const mockApplyPromotion = jest.fn()
  const mockDispatch = jest.fn()

  jest.mock('../../hooks/firebase/useUser', () => ({
    useApplyPromotion: () => ({ applyPromotion: mockApplyPromotion }),
  }))

  // @ts-ignore
  jest.mock('../../context/NotificationContext', () => ({
    NotificationContext: {
      Consumer: ({ children }: { children: ({ dispatch }: { dispatch: Function }) => React.ReactNode }) => children({ dispatch: mockDispatch }),
    },
  }))


  beforeAll(async () => {
    await act( async () => render(
        <Router>
          <Footer role={UserRole.READER}/>
        </Router>,
      )
    )
    jest.setTimeout(15000)
  })

  test('style', () => {

    const [feather, logo] = screen.getAllByRole('img')
    expect(feather).toBeInTheDocument()
    expect(feather).toHaveAttribute('src', 'feather.png')
    expect(feather).toHaveAttribute('height', '60rem')
    expect(feather).toHaveAttribute('width', '80rem')

    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', 'logo.png')
    expect(logo).toHaveAttribute('height', '35rem')
    expect(logo).toHaveAttribute('width', '60rem')

    const becomeAContributorButton = screen.getByRole('button')
    expect(becomeAContributorButton).toBeInTheDocument()
    expect(becomeAContributorButton).toBeEnabled()
    expect(becomeAContributorButton).toContainElement(screen.getByText('Become a contributor'))
    expect(screen.getByText('Become a contributor')).toBeInTheDocument()

    const getStartedButton = screen.queryByRole('button', { name: /get started/i });
    expect(getStartedButton).not.toBeInTheDocument()

    const createBlogButton = screen.queryByRole('button', { name: /create blog/i });
    expect(createBlogButton).not.toBeInTheDocument()

    const homeCaption = screen.getByText('Home')
    expect(homeCaption).toBeInTheDocument()

    const aboutUsCaption = screen.getByText('About Us')
    expect(aboutUsCaption).toBeInTheDocument()

    const copyright = screen.getByText('@2023')
    expect(copyright).toBeInTheDocument()

    const callToAction = screen.getByText('Start by writing something simple')
    expect(callToAction).toBeInTheDocument()

  })

  test('test applying to become a contributor', async ()=> {
    console.log(screen)
    const becomeAContributorButton = screen.getByTestId('apply-contributor-btn')
    await act( async () => userEvent.click(becomeAContributorButton))
    expect(mockApplyPromotion).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledWith({
      notificationActionType: 'success',
      message: 'Successfully applied to become contributor!',
    })
  })
})
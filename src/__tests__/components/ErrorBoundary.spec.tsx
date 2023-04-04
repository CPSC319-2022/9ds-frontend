import { render } from '@testing-library/react'
import { ErrorBoundary } from 'components/ErrorBoundary'

describe('Error Boundary', () => {
  it('renders child component', () => {
    const { getByText } = render(
        <ErrorBoundary>
          <h1>TEST CONTENT</h1>
        </ErrorBoundary>,
    )
    expect(getByText('TEST CONTENT')).toBeInTheDocument()
  })
})

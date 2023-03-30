import { render } from '@testing-library/react'
import { UserType } from '../../components/UserType/UserType'

describe('UserType', () => {
  it('should render for reader view', () => {
    const { getByText } = render(<UserType type='reader' />)
    expect(getByText('Become a Reader')).toBeInTheDocument()
  })

  it('should render for contributor view', () => {
    const { getByText } = render(<UserType type='contributor' />)
    expect(getByText('Become a Contributor')).toBeInTheDocument()
  })
})

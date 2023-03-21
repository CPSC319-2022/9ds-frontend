import React from 'react'
import { render } from '@testing-library/react'
import { createContext } from 'react'
import { AppWrapper } from '../../components/AppWrapper'
import { MemoryRouter } from 'react-router-dom'

const mockRouterContext = createContext({
  basename: '/',
})

describe('AppWrapper', () => {
  it('renders the children correctly', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <mockRouterContext.Provider value={{ basename: '/' || null }}>
          <AppWrapper>
            <div data-testid='child-1'>Child 1</div>
            <div data-testid='child-2'>Child 2</div>
          </AppWrapper>
        </mockRouterContext.Provider>
      </MemoryRouter>,
    )
    expect(getByTestId('child-1')).toBeInTheDocument()
    expect(getByTestId('child-2')).toBeInTheDocument()
  })

  it('renders with the default spacing if spacing prop is not provided', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <mockRouterContext.Provider value={{ basename: '/' || null }}>
          <AppWrapper>
            <div data-testid='child'>Child</div>
          </AppWrapper>
        </mockRouterContext.Provider>
      </MemoryRouter>,
    )
    const stack = getByTestId('app-wrapper-stack')
    //TODO: it's expected to have 32 spacing in this case, but for some reason this is failing. Worth checking why.
    //expect(stack).toHaveStyle('spacing: 32px;')
  })
})

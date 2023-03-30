import React from 'react'
import * as hooks from 'hooks/firebase/useUser'
import { act, render } from '@testing-library/react'
import { createContext } from 'react'
import { AppWrapper } from '../../components/AppWrapper'
import { MemoryRouter } from 'react-router-dom'
import {
  adminData,
  contributorData,
  readerData,
} from '__tests__/firestore/firestore_testing_data'

const mockRouterContext = createContext({
  basename: '/',
})

describe('AppWrapper', () => {
  it('renders the children correctly', async () => {
    const { getByTestId } = await act(async () =>
      render(
        <MemoryRouter>
          <mockRouterContext.Provider value={{ basename: '/' || null }}>
            <AppWrapper>
              <div data-testid='child-1'>Child 1</div>
              <div data-testid='child-2'>Child 2</div>
            </AppWrapper>
          </mockRouterContext.Provider>
        </MemoryRouter>,
      ),
    )
    expect(getByTestId('child-1')).toBeInTheDocument()
    expect(getByTestId('child-2')).toBeInTheDocument()
  })

  it('renders with the default spacing if spacing prop is not provided', async () => {
    const { getByTestId } = await act(async () =>
      render(
        <MemoryRouter>
          <mockRouterContext.Provider value={{ basename: '/' || null }}>
            <AppWrapper>
              <div data-testid='child'>Child</div>
            </AppWrapper>
          </mockRouterContext.Provider>
        </MemoryRouter>,
      ),
    )
    expect(getByTestId('app-wrapper-stack')).toBeInTheDocument()
  })

  it('should render for reader view', () => {
    jest.spyOn(hooks, 'useUser').mockImplementation(() => ({
      queriedUser: readerData,
      error: undefined,
      loading: false,
    }))

    const { getByTestId, getByText } = render(
      <MemoryRouter>
        <AppWrapper>
          <></>
        </AppWrapper>
      </MemoryRouter>,
    )
    expect(getByTestId('app-wrapper-stack')).toBeInTheDocument()
  })

  it('should render for contributor view', () => {
    jest.spyOn(hooks, 'useUser').mockImplementation(() => ({
      queriedUser: contributorData,
      error: undefined,
      loading: false,
    }))

    const { getByTestId, getByText } = render(
      <MemoryRouter>
        <AppWrapper>
          <></>
        </AppWrapper>
      </MemoryRouter>,
    )
    expect(getByTestId('app-wrapper-stack')).toBeInTheDocument()
  })

  it('should render for admin view', () => {
    jest.spyOn(hooks, 'useUser').mockImplementation(() => ({
      queriedUser: adminData,
      error: undefined,
      loading: false,
    }))

    const { getByTestId, getByText } = render(
      <MemoryRouter>
        <AppWrapper>
          <></>
        </AppWrapper>
      </MemoryRouter>,
    )
    expect(getByTestId('app-wrapper-stack')).toBeInTheDocument()
  })
})

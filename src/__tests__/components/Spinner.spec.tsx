import { render, screen } from '@testing-library/react'
import { handleLoading, Spinner } from '../../components/Spinner/Spinner'


describe('Spinner', () => {
  beforeAll(() => {
    render(<Spinner />)
    jest.setTimeout(15000)
  })

  test('style/components', () => {
    const circle = screen.getByRole("progressbar")
    expect(circle).toBeInTheDocument()
  })
})

describe('Handle Loading', () => {
    test('handle loading expected component', () => {
      const expectedComponent = (<div id='main'></div>)
      expect(handleLoading(false, expectedComponent)).toEqual(expectedComponent)

    })

    test('handle loading expected spinner', () => {
        const expectedComponent = (<div></div>)
        expect(handleLoading(true, expectedComponent)).toEqual(<Spinner />)
      })
  })
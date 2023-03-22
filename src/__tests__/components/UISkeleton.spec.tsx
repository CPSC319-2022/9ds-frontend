import { render, screen } from '@testing-library/react'
import { UISkeleton } from '../../components/UISkeleton'

describe('UISkeleton', () => {
  it('renders the correct number of skeleton elements', () => {
    render(<UISkeleton elemWidth='100px' elemHeight='100px' elems={3} />)
    const skeletonElements = screen.getAllByRole('progressbar', {
      hidden: true,
    })
    expect(skeletonElements.length).toBe(3)
  })

  it('renders skeleton elements with the correct dimensions', () => {
    render(<UISkeleton elemWidth='100px' elemHeight='100px' elems={2} />)
    const skeletonElements = screen.getAllByRole('progressbar', {
      hidden: true,
    })
    skeletonElements.forEach((element) => {
      expect(element).toHaveStyle('width: 100px;')
      expect(element).toHaveStyle('height: 100px;')
    })
  })

  it('renders skeleton elements with the correct border radius', () => {
    render(<UISkeleton elemWidth='100px' elemHeight='100px' elems={1} />)
    const skeletonElement = screen.getByRole('progressbar', { hidden: true })
    expect(skeletonElement).toHaveStyle('border-radius: 12px;')
  })
})

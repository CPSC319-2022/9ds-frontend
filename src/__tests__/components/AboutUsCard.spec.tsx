import { render, screen } from '@testing-library/react'
import { AboutUsCard } from '../../components/AboutUsCard'

describe('AboutUsCard', () => {
  const props = {
    picture: 'https://example.com/image.png',
    fullName: 'John Doe',
    title: 'Software Engineer',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  }

  it('renders the component with the correct props', () => {
    render(<AboutUsCard {...props} />)

    // Check that the full name is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument()

    // Check that the title is rendered
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()

    // Check that the description is rendered
    expect(
      screen.getByText(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      ),
    ).toBeInTheDocument()
  })

  it('renders the component with the correct styling', () => {
    render(<AboutUsCard {...props} />)

    // Check that the component has the correct width
    expect(screen.getByTestId('about-us-card')).toHaveStyle('width: 345px;')

    // Check that the component has the correct height
    expect(screen.getByTestId('about-us-card')).toHaveStyle('height: 288px;')

    // Check that the component has the correct border radius
    expect(screen.getByTestId('about-us-card')).toHaveStyle(
      'border-radius: 12px;',
    )

    // Check that the component has the correct background color
    expect(screen.getByTestId('about-us-card')).toHaveStyle(
      'background-color: white.grey;',
    )

    // Check that the component has the correct padding
    //maybe we need to change this, keeping for now
    expect(screen.getByTestId('about-us-card')).toHaveStyle(
      'padding: 12px 20.5px 12px 20.5px;',
    )
  })

  //Need suggestions on how we can properly test this once src info becomes         dynamically populated
  //   it('renders the image with the correct src', () => {
  //     render(<AboutUsCard {...props} />);

  //     // Check that the image has the correct src
  //     expect(screen.getByAltText('John Doe')).toHaveAttribute('src', 'https://example.com/image.png');
  //   });

  it('truncates the description correctly', () => {
    const longDescription =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis enim vitae metus molestie tristique sed vel nibh. Sed et orci justo.'

    render(<AboutUsCard {...props} description={longDescription} />)

    // Check that the description is truncated after 2 lines
    expect(
      screen.getByText(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis enim vitae metus molestie tristique sed vel nibh. Sed et orci justo.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis enim vitae metus molestie tristique sed vel nibh. Sed et orci justo.',
      ).tagName,
    ).toEqual('P')
  })
})

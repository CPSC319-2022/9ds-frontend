import { render, fireEvent } from '@testing-library/react'
import { ItemGrid, ItemGridType } from 'components/ItemGrid'
import { Timestamp } from 'firebase/firestore'
import { MemoryRouter } from 'react-router-dom'

describe('ItemGrid', () => {
  it('should render correctly', () => {
    const { getAllByTestId } = render(
      <MemoryRouter>
        <ItemGrid
          type={ItemGridType.ARTICLES}
          items={[
            {
              title: 'test1',
              content: 'test1',
              header_image:
                'https://media.itpro.co.uk/image/upload/v1570816541/itpro/2018/12/bigdata_shutterstock_1142996930.jpg',
              author_image:
                'https://media.itpro.co.uk/image/upload/v1570816541/itpro/2018/12/bigdata_shutterstock_1142996930.jpg',
              author_username: 'tester',
              articleId: 'test1',
              publish_time: new Timestamp(2, 2),
            },
            {
              title: 'test1',
              content: 'test1',
              header_image:
                'https://media.itpro.co.uk/image/upload/v1570816541/itpro/2018/12/bigdata_shutterstock_1142996930.jpg',
              author_image:
                'https://media.itpro.co.uk/image/upload/v1570816541/itpro/2018/12/bigdata_shutterstock_1142996930.jpg',
              author_username: 'tester',
              articleId: 'test2',
              publish_time: new Timestamp(2, 2),
            },
            {
              title: 'test1',
              content: 'test1',
              header_image:
                'https://media.itpro.co.uk/image/upload/v1570816541/itpro/2018/12/bigdata_shutterstock_1142996930.jpg',
              author_image:
                'https://media.itpro.co.uk/image/upload/v1570816541/itpro/2018/12/bigdata_shutterstock_1142996930.jpg',
              author_username: 'tester',
              articleId: 'test3',
              publish_time: new Timestamp(2, 2),
            },
            {
              title: 'test1',
              content: 'test1',
              header_image:
                'https://media.itpro.co.uk/image/upload/v1570816541/itpro/2018/12/bigdata_shutterstock_1142996930.jpg',
              author_image:
                'https://media.itpro.co.uk/image/upload/v1570816541/itpro/2018/12/bigdata_shutterstock_1142996930.jpg',
              author_username: 'tester',
              articleId: 'test4',
              publish_time: new Timestamp(2, 2),
            },
          ]}
        />
      </MemoryRouter>,
    )
    const gridItems = getAllByTestId('grid-item')
    expect(gridItems.length).toEqual(4)
  })
})

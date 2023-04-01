import { Timestamp } from 'firebase/firestore'
import sample from '../assets/sample.jpg'
import profile from '../assets/profile.png'
import { ArticlePreview } from 'types/Article'

export const TEST_ARTICLE: ArticlePreview = {
  title: 'Article title here',
  content: 'Article descriptions ble bla lba etc etc ajsdfoiajwoignai',
  header_image: sample,
  author_image: profile,
  author_username: 'Emma Watson',
  publish_time: new Timestamp(new Date('01/18/2022').getSeconds(), 0),
  articleId: '1',
}

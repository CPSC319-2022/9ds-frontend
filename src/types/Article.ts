import { Timestamp } from 'firebase/firestore'

export interface ArticlePreview {
  title: string
  content: string
  header_image: string
  author_image: string
  author_username: string
  publish_time: Timestamp
  articleId: string
}

export interface Article {
  title: string
  content: string
  header_image: string
  author_image: string
  author_uid: string
  edit_time: Timestamp
  author_username: string
  publish_time: Timestamp
}

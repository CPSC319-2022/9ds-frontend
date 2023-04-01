import { DocumentData, QuerySnapshot } from 'firebase/firestore'
import { ArticlePreview } from 'types/Article'

export const articlePreviewTranslator = (
  docs: QuerySnapshot<DocumentData>,
): ArticlePreview[] => {
  const articlesData: ArticlePreview[] = []
  docs.forEach((doc) => {
    articlesData.push({
      title: doc.data().title,
      content: doc.data().content,
      header_image: doc.data().header_image,
      author_image: doc.data().author_image,
      author_username: doc.data().author_username,
      publish_time: doc.data().publish_time,
      articleId: doc.id,
    })
  })

  return articlesData
}

export const articleDraftTranslator = (
  docs: QuerySnapshot<DocumentData>,
): ArticlePreview[] => {
  const articlesData: ArticlePreview[] = []
  docs.forEach((doc) => {
    articlesData.push({
      title: doc.data().title,
      content: doc.data().content,
      header_image: doc.data().header_image,
      author_image: doc.data().author_image,
      author_username: doc.data().author_username,
      publish_time: doc.data().edit_time,
      articleId: doc.id,
    })
  })

  return articlesData
}

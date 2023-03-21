import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QuerySnapshot,
  FirestoreErrorCode,
  QueryDocumentSnapshot,
  FirestoreError,
  getDoc,
  getDocs,
  startAfter,
} from 'firebase/firestore'
import { useState, useEffect, useContext } from 'react'
import { getUser, UserData } from './useUser'
import { comment } from './useComment'
import { db } from '../../firebaseApp'
import { useAuth } from './useAuth'
import { NotificationContext } from '../../context/NotificationContext'

/* eslint-disable @typescript-eslint/no-unused-vars */

export interface ArticlePreview {
  title: string
  content: string
  header_image: string
  author_image: string
  author_username: string
  publish_time: Timestamp
  articleId: string
}

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

export const useArticleRecents = (n: number) => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)
  const [loadingNext, setLoadingNext] = useState(false)
  const [articles, setArticles] = useState<ArticlePreview[]>([])

  const q = query(
    collection(db, 'article'),
    where('published', '==', true),
    orderBy('publish_time', 'desc'),
  )

  const [lastArticle, setLastArticle] =
    useState<QueryDocumentSnapshot<DocumentData>>()
  const [endOfCollection, setEndOfCollection] = useState(false)

  useEffect(() => {
    getDocs(query(q, limit(n)))
      .then((docs: QuerySnapshot<DocumentData>) => {
        setLoading(false)
        setArticles(articlePreviewTranslator(docs))
        setLastArticle(docs.docs[docs.docs.length - 1])
        setEndOfCollection(docs.docs.length < n)
      })
      .catch((err: FirestoreError) => {
        setError(err.code)
      })
  }, [])

  const getNext = (n: number) => {
    setLoadingNext(true)
    getDocs(query(q, startAfter(lastArticle), limit(n)))
      .then((docs: QuerySnapshot<DocumentData>) => {
        setLoadingNext(false)
        setArticles(articles.concat(articlePreviewTranslator(docs)))
        setLastArticle(docs.docs[docs.docs.length - 1])
        setEndOfCollection(docs.docs.length < n)
      })
      .catch((err: FirestoreError) => {
        setError(err.code)
      })
  }

  return { getNext, error, loading, loadingNext, articles, endOfCollection }
}

export const useArticleRead = (articleID: string) => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)
  const [article, setArticle] = useState<Article>()

  useEffect(() => {
    getDoc(doc(db, 'article', articleID))
      .then((doc) => {
        const data = doc.data()
        if (data === undefined) {
          setError('not-found')
        } else {
          setLoading(false)
          setArticle(data as Article)
        }
      })
      .catch((err: FirestoreError) => {
        setError(err.code)
      })
  }, [articleID])

  return { error, loading, article }
}

export const useArticleComments = (articleID: string, n: number) => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState<comment[]>([])
  const [loadingNext, setLoadingNext] = useState(false)

  const q = query(
    collection(db, `article/${articleID}/comments`),
    orderBy('post_time', 'desc'),
  )

  const [lastComment, setLastComment] =
    useState<QueryDocumentSnapshot<DocumentData>>()
  const [endOfCollection, setEndOfCollection] = useState(false)

  useEffect(() => {
    getDocs(query(q, limit(n)))
      .then((docs: QuerySnapshot<DocumentData>) => {
        const commentsData: comment[] = []
        docs.forEach((doc) => {
          commentsData.push({
              commenter_uid: doc.data().commenter_uid,
              commenter_image: doc.data().commenter_image,
              commenter_username: doc.data().commenter_username,
              content: doc.data().content,
              post_time: doc.data().post_time,
              commentID: doc.id
          })
        })
        setLoading(false)
        setComments(commentsData)
        setLastComment(docs.docs[docs.docs.length - 1])
        setEndOfCollection(docs.docs.length < n)
      })
      .catch((err: FirestoreError) => {
        setError(err.code)
      })
  }, [articleID])

  const getNext = (n: number) => {
    setLoadingNext(true)
    getDocs(query(q, startAfter(lastComment), limit(n)))
      .then((docs: QuerySnapshot<DocumentData>) => {
        const commentsData: comment[] = []
        docs.forEach((doc) => {
          commentsData.push({
              commenter_uid: doc.data().commenter_uid,
              commenter_image: doc.data().commenter_image,
              commenter_username: doc.data().commenter_username,
              content: doc.data().content,
              post_time: doc.data().post_time,
              commentID: doc.id
        })
        })
        setLoadingNext(false)
        setComments(comments.concat(commentsData))
        setLastComment(docs.docs[docs.docs.length - 1])
        setEndOfCollection(docs.docs.length < n)
      })
      .catch((err: FirestoreError) => {
        setError(err.code)
      })
  }

  return { getNext, error, loading, loadingNext, comments, endOfCollection }
}

export const useArticleCreate = () => {
  const { user: currentUser } = useAuth()
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(false)
  const [articleId, setArticleId] = useState<string>()

  const createArticle = (
    title: string,
    content: string,
    header_image: string,
    published: boolean,
  ) => {
    getUser(currentUser?.uid ?? null)
      .then((user: UserData) =>
        addDoc(collection(db, 'article'), {
          author_uid: user.uid,
          author_image: user.profile_image,
          author_username: user.username,
          content: content,
          edit_time: serverTimestamp(),
          header_image: header_image,
          published: published,
          publish_time: published ? serverTimestamp() : null,
          title: title,
        }).then(
          (doc) => {
            setLoading(true)
            setArticleId(doc.id)
          },
          (err) => {
            setLoading(false)
            setError(err.code)
          },
        ),
      )
      .catch((err) => {
        setError('unauthenticated')
      })
  }

  return { createArticle, error, loading, articleId }
}

export const useArticleEdit = () => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(false)

  const editArticle = (
    articleID: string,
    title: string,
    content: string,
    header_image: string,
    published: boolean,
  ) => {
    setLoading(true)
    updateDoc(doc(db, 'article', articleID), {
      content: content,
      edit_time: serverTimestamp(),
      header_image: header_image,
      published: published,
      publish_time: published ? serverTimestamp() : null,
      title: title,
    }).then(
      (doc) => {
        setLoading(false)
      },
      (err) => {
        setError(err.code)
      },
    )
    setLoading(false)
  }

  return { editArticle, error, loading }
}

export const useArticlePost = () => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)

  const postArticle = (articleID: string) => {
    updateDoc(doc(db, 'article', articleID), {
      edit_time: serverTimestamp(),
      published: true,
      publish_time: serverTimestamp(),
    }).then(
      () => {
        setLoading(false)
      },
      (err) => {
        setError(err.code)
      },
    )
  }

  return { postArticle, error, loading }
}

export const useArticleDelete = (articleID: string) => {
  const { dispatch } = useContext(NotificationContext)
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)

  const deleteArticle = async () =>
    deleteDoc(doc(db, 'article', articleID)).then(
      () => {
        dispatch({
          notificationActionType: 'success',
          message: `Successfuly deleted article`,
        })
        setLoading(false)
      },
      (err) => {
        dispatch({
          notificationActionType: 'error',
          message: `Error deleting article. Error code: ${err.code}`,
        })
        setError(err.code)
      },
    )

  return { deleteArticle, error, loading }
}

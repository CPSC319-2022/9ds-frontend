import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QuerySnapshot,
  FirestoreErrorCode,
  FirestoreError,
} from 'firebase/firestore'
import { db } from '../../index'
import { useState, useEffect } from 'react'
import { useUser } from './useUser'
import { comment } from './useComment'

/* eslint-disable @typescript-eslint/no-unused-vars */

export interface articlePreview {
  title: string
  content: string
  header_image: string
  author_image: string
  author_username: string
  publish_time: Timestamp
  articleId: string
}

export interface article {
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
  const [articles, setArticles] = useState<articlePreview[]>()
  const articleRef = collection(db, 'article')

  useEffect(() => {
    const q = query(
      articleRef,
      where('published', '==', true),
      orderBy('publish_time'),
      limit(n),
    )

    const unsubscribe = onSnapshot(
      q,
      (docs: QuerySnapshot<DocumentData>) => {
        const articlesData: articlePreview[] = []
        docs.forEach((doc) => {
          articlesData.push({
            title: doc.data().title,
            content: doc.data().content,
            header_image: doc.data().header_image,
            author_image: doc.data().author_image,
            author_username: doc.data().author_username,
            publish_time: doc.data().publish_time,
            articleId: doc.id
          })
        })
        setLoading(false), setArticles(articlesData)
      },
      (err) => {
        setError(err.code)
      },
    )

    return () => unsubscribe()
  }, [])

  return { error, loading, articles }
}

export const useArticleRead = (articleID: string) => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)
  const [article, setArticle] = useState<article>()

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'article', articleID),
      (doc) => {
        const data = doc.data()
        if (data === undefined) {
          setError('not-found')
        } else {
          setLoading(false)
          setArticle(data as article)
        }
      },
      (err: FirestoreError) => {
        setError(err.code)
      },
    )

    return () => unsubscribe()
  }, [articleID])

  return { error, loading, article }
}

export const useArticleComments = (articleID: string, n: number) => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState<comment[]>([])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, `article/${articleID}/comments`), limit(n)),
      (docs: QuerySnapshot<DocumentData>) => {
        const commentsData: DocumentData[] = []
        docs.forEach((doc) => {
          commentsData.push(doc.data)
        })
        setLoading(false), setComments(commentsData as comment[])
      },
      (err) => {
        setError(err.code)
      },
    )

    return () => unsubscribe()
  }, [articleID])

  return { error, loading, comments }
}

export const useArticleCreate = (
  title: string,
  content: string,
  header_image: string,
  published: boolean,
) => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)
  const [articleId, setArticleId] = useState<string>()
  const articleRef = collection(db, 'article')
  // dsad
  useEffect(() => {
    const { error, loading, queriedUser } = useUser()
    if (error === null && !loading) {
      addDoc(articleRef, {
        author_uid: queriedUser.uid,
        author_image: queriedUser.profile_image,
        author_username: queriedUser.username,
        content: content,
        edit_time: serverTimestamp(),
        header_image: header_image,
        published: published,
        publish_time: published ? serverTimestamp() : null,
        title: title,
      }).then(
        (doc) => {
          setLoading(false)
          setArticleId(doc.id)
        },
        (err) => {
          setError(err.code)
        },
      )
    }
  }, [title, content, header_image, published])

  return { error, loading, articleId }
}

export const useArticleEdit = (
  articleID: string,
  title: string,
  content: string,
  header_image: string,
  published: boolean,
) => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { error, loading, queriedUser } = useUser()
    if (error === null && !loading) {
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
    }
  }, [articleID, content, header_image, published])

  return { error, loading }
}

export const useArticlePost = (articleID: string) => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { error, loading, queriedUser } = useUser()
    if (error === null && !loading) {
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
  }, [articleID])

  return { error, loading }
}

export const useArticleDelete = (articleID: string) => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { error, loading, queriedUser } = useUser()
    if (error === null && !loading) {
      deleteDoc(doc(db, 'article', articleID)).then(
        () => {
          setLoading(false)
        },
        (err) => {
          setError(err.code)
        },
      )
    }
  }, [articleID])

  return { error, loading }
}

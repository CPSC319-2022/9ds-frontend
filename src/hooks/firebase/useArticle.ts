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
  FirestoreError, getDoc, getDocs,
} from 'firebase/firestore'
import {auth, db} from '../../index'
import { useState, useEffect } from 'react'
import {getUser, UserData} from './useUser'
import { comment } from './useComment'

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

export const articlePreviewTranslator = (docs: QuerySnapshot<DocumentData>): ArticlePreview[] => {
    const articlesData: ArticlePreview[] = []
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

    return articlesData
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
  const [articles, setArticles] = useState<ArticlePreview[]>()

  useEffect(() => {
    const q = query(
        collection(db, 'article'),
      where('published', '==', true),
      orderBy('publish_time'),
      limit(n),
    )

    getDocs(q)
        .then((docs: QuerySnapshot<DocumentData>) => {
            setLoading(false);
            setArticles(articlePreviewTranslator(docs))
      }).catch((err) => {
        setError(err.code)
      })
  }, [])

  return { error, loading, articles }
}

export const useArticleRead = (articleID: string) => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)
  const [article, setArticle] = useState<article>()

  useEffect(() => {
    getDoc(doc(db, 'article', articleID))
        .then((doc) => {
        const data = doc.data()
        if (data === undefined) {
          setError('not-found')
        } else {
          setLoading(false)
          setArticle(data as article)
        }
      }).catch((err: FirestoreError) => {
        setError(err.code)
      }
    )
  }, [articleID])

  return { error, loading, article }
}

export const useArticleComments = (articleID: string, n: number) => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState<comment[]>([])

  useEffect(() => {
    getDocs(query(collection(db, `article/${articleID}/comments`), limit(n)))
        .then((docs: QuerySnapshot<DocumentData>) => {
            const commentsData: DocumentData[] = []
            docs.forEach((doc) => {
                commentsData.push(doc.data)
            })
            setLoading(false)
            setComments(commentsData as comment[])
      }).catch((err: FirestoreError) => {
            setError(err.code)
      })

  }, [articleID])

  return {error, loading, comments }
}

export const useArticleCreate = () => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)
  const [articleId, setArticleId] = useState<string>()

  const createArticle = (
      title: string,
      content: string,
      header_image: string,
      published: boolean) => {

    getUser(auth.currentUser === null ? null: auth.currentUser.uid)
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
                setLoading(false)
                setArticleId(doc.id)
            },
            (err) => {
                setError(err.code)
            }))
        .catch((err) => {
          setError("unauthenticated")
        })
    };

  return {createArticle, error, loading, articleId }
}

export const useArticleEdit = () => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)

  const editArticle = (
      articleID: string,
      title: string,
      content: string,
      header_image: string,
      published: boolean,
  ) => {
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
    }
    )
  };

  return {editArticle, error, loading }
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
  };

  return {postArticle, error, loading }
}

export const useArticleDelete = (articleID: string) => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)

  const deleteArticle = () => {
    deleteDoc(doc(db, 'article', articleID)).then(
      () => {
        setLoading(false)
      },
      (err) => {
        setError(err.code)
      },
    )
  };

  return {deleteArticle, error, loading }
}

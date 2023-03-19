import {
  addDoc,
  deleteDoc,
  doc,
  collection,
  updateDoc,
  serverTimestamp,
  Timestamp,
  FirestoreErrorCode,
} from 'firebase/firestore'
import { db } from '../../firebaseApp'
import { useState } from 'react'
import { getUser } from './useUser'
import { useAuth } from './useAuth'

/* eslint-disable @typescript-eslint/no-unused-vars */

export interface comment {
  commenter_uid: string
  commenter_image: string
  commenter_username: string
  content: string
  post_time: Timestamp
  commentID: string
}

export const useCommentCreate = () => {
  const { user: currentUser } = useAuth()
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)
  const [commentId, setCommentId] = useState<string>()
  const createComment = (articleID: string, comment: comment) => {
    getUser(currentUser?.uid ?? null)
      .then((user) =>
        addDoc(collection(db, `article/${articleID}/comments`), {
          commenter_uid: user.uid,
          profile_image: user.profile_image,
          commenter_username: user.username,
          content: comment,
          post_time: serverTimestamp(),
        })
          .then((doc) => {
            setLoading(false)
            setCommentId(doc.id)
          })
          .catch((err) => {
            setError(err.code)
          }),
      )
      .catch((err) => {
        setError('unauthenticated')
      })
  }

  return { createComment, error, loading, commentId }
}

export const useCommentEdit = () => {
  const { user: currentUser } = useAuth()
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)

  const editComment = (
    articleID: string,
    commentID: string,
    comment: unknown,
  ) => {
    if (currentUser) {
      updateDoc(doc(db, `article/${articleID}/comments`, commentID), {
        content: comment,
      })
        .then(() => {
          setLoading(false)
        })
        .catch((err) => {
          setError(err.code)
        })
    } else {
      setError('permission-denied')
    }
  }

  return { editComment, error, loading }
}

export const useCommentDelete = () => {
  const { user: currentUser } = useAuth()
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)

  const deleteComment = (articleID: string, commentID: string) => {
    if (currentUser) {
      deleteDoc(doc(db, `article/${articleID}/comments`, commentID))
        .then(() => {
          setLoading(false)
        })
        .catch((err) => {
          setError(err.code)
        })
    } else {
      setError('permission-denied')
    }
  }

  return { deleteComment, error, loading }
}

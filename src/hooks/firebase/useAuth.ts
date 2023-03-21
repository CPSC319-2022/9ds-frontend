import { useState, useContext } from 'react'
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from 'firebase/auth'
import { doc, FirestoreErrorCode, setDoc } from 'firebase/firestore'
import { auth, db } from '../../firebaseApp'
import { UserData, getUser } from './useUser'
import { FirebaseError } from 'firebase/app'
import { AuthContext } from '../../context/AuthContext'

export const useAuth = () => {
  const {
    state: { currentUser, initializing },
  } = useContext(AuthContext)

  return {
    initializing,
    user: currentUser ?? null,
  }
}

const createNewUser = (
  currentUser: User | null,
  username: string,
  profile_image: string,
): Promise<void> => {
  if (!currentUser) {
    return Promise.reject('failed_precondition')
  }
  return setDoc(doc(db, 'users', currentUser.uid), {
    role: 'reader',
    username: username,
    profile_image: profile_image,
  })
}

export const useCreateUserEmailPassword = () => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserData>()

  const createWithEmailAndPasswordWrapper = (
    email: string,
    password: string,
    username: string,
    profile_image: string,
  ) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user: newUser }) => {
        createNewUser(newUser, username, profile_image)
          .then(() => {
            setLoading(false)
            setUser({
              role: 'reader',
              profile_image: profile_image,
              username: username,
              uid: newUser.uid,
            })
          })
          .catch((err) => {
            setError(err)
          })
      })
      .catch((err) => {
        setError(err.code)
      })
  }

  return { createWithEmailAndPasswordWrapper, error, loading, user }
}

export const useSignInUserEmailPassword = () => {
  const { user: currentUser } = useAuth()
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserData>()

  const signInWithEmailAndPasswordWrapper = (
    email: string,
    password: string,
  ) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        getUser(currentUser?.uid ?? null)
          .then((user) => {
            setLoading(false)
            setUser(user)
          })
          .catch((err) => {
            setError(err)
          })
      })
      .catch((err) => {
        setError(err.code)
      })
  }

  return { signInWithEmailAndPasswordWrapper, error, loading, user }
}

export const useSignInWithGoogle = () => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserData>()

  const provider = new GoogleAuthProvider()

  const signInWithGoogleWrapper = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const additionalInfo = getAdditionalUserInfo(result)
        if (additionalInfo?.isNewUser) {
          const profile = additionalInfo.profile
          if (profile === null) {
            setError('unknown')
          } else {
            createNewUser(
              result.user,
              profile.name as string,
              profile.picture as string,
            )
              .then(() => {
                setLoading(false)
                setUser({
                  role: 'reader',
                  profile_image: profile.picture as string,
                  username: profile.name as string,
                  uid: result.user.uid,
                })
              })
              .catch((err) => {
                setError(err)
              })
          }
        } else {
          getUser(result.user.uid)
            .then((user) => {
              setLoading(false)
              setUser(user)
            })
            .catch((err) => {
              setError(err)
            })
        }
      })
      .catch((err) => {
        setError(err.code)
      })
  }
  return { signInWithGoogleWrapper, error, loading, user }
}

export const useForgotPasswordEmail = () => {
  const [error, setError] = useState<FirebaseError>()
  const [loading, setLoading] = useState(true)

  const sendEmail = (email: string) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
      })
  }

  return { sendEmail, error, loading }
}

export const useResetCode = () => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')

  const verifyCode = (actionCode: string) => {
    verifyPasswordResetCode(auth, actionCode)
      .then((accountEmail) => {
        setEmail(accountEmail)
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
      })
  }

  return { verifyCode, error, loading, email }
}

export const useNewPassword = () => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)

  const setNewPassword = (actionCode: string, password: string) => {
    confirmPasswordReset(auth, actionCode, password)
      .then(() => {
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
      })
  }

  return { setNewPassword, error, loading }
}

export const useSignOut = () => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)
  const [signedOut, setSignedOut] = useState<boolean>()

  const signOutWrapper = () => {
    signOut(auth)
      .then(() => {
        setLoading(false)
        setSignedOut(true)
      })
      .catch((err) => {
        setError(err)
      })
  }

  return { signOutWrapper, error, loading, signedOut }
}

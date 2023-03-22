import { useState, useContext } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  UserCredential,
  deleteUser,
} from 'firebase/auth'
import { auth, storage } from '../../firebaseApp'
import { FirebaseError } from 'firebase/app'
import { AuthContext } from '../../context/AuthContext'
import {
  getDownloadURL,
  ref,
  StorageErrorCode,
  uploadBytes,
} from '@firebase/storage'
import { FirestoreErrorCode } from 'firebase/firestore'
import { UserData } from 'types/UserData'
import { createNewUser, getUser } from 'utils/firebase/user'

export const useAuth = () => {
  const {
    state: { currentUser, initializing },
  } = useContext(AuthContext)

  return {
    initializing,
    user: currentUser ?? null,
  }
}

export const useCreateUserEmailPassword = () => {
  const [error, setError] = useState<FirestoreErrorCode | StorageErrorCode>()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserData>()

  const createWithEmailAndPasswordWrapper = (
    email: string,
    password: string,
    username: string,
    profile_image: string | File,
  ) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user: newUser }) => {
        if (!(typeof profile_image === 'string')) {
          const storageRef = ref(
            storage,
            `${newUser.uid}/${profile_image.name}`,
          )
          uploadBytes(
            ref(storage, `${newUser.uid}/${profile_image.name}`),
            profile_image,
          )
            .then(() => {
              getDownloadURL(storageRef).then((res) => {
                createNewUser(newUser, username, res).then(() => {
                  setUser({
                    role: 'reader',
                    profile_image: res,
                    username: username,
                    uid: newUser.uid,
                  })
                  setLoading(false)
                })
              })
            })
            .catch((err) => {
              setError(err.code)
              return deleteUser(newUser)
            })
        } else {
          createNewUser(newUser, username, profile_image as string)
            .then(() => {
              setUser({
                role: 'reader',
                profile_image: profile_image as string,
                username: username,
                uid: newUser.uid,
              })
              setLoading(false)
            })
            .catch((err) => {
              setError(err.code)
              return deleteUser(newUser)
            })
        }
      })
      .catch((err) => {
        setError(err.code)
      })
  }

  return { createWithEmailAndPasswordWrapper, error, loading, user }
}

export const useSignInUserEmailPassword = () => {
  const [error, setError] = useState<FirestoreErrorCode | undefined>()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserData>()

  const signInWithEmailAndPasswordWrapper = (
    email: string,
    password: string,
  ) => {
    setError(undefined)
    setLoading(true)
    signInWithEmailAndPassword(auth, email, password)
      .then(({ user: newUser }: UserCredential) => {
        console.log(`Signing in with user uid ${newUser} ${newUser.uid}`)
        getUser(newUser.uid)
          .then((user) => {
            if (user.role === 'banned') {
              setError('permission-denied')
              setLoading(false)
              setUser(undefined)
              return signOut(auth)
            }
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

  return {
    signInWithEmailAndPasswordWrapper,
    error,
    loading,
    user,
  }
}

export const useSignInWithGoogle = () => {
  const [error, setError] = useState<FirestoreErrorCode | undefined>()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserData>()

  const provider = new GoogleAuthProvider()

  const signInWithGoogleWrapper = () => {
    setError(undefined)
    setLoading(true)
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
              if (user.role === 'banned') {
                setError('permission-denied')
                setLoading(false)
                setUser(undefined)
                return signOut(auth)
              }
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

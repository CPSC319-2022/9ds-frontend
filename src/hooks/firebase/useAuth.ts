import { useState, useContext, useEffect } from 'react'
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
  UserCredential,
} from 'firebase/auth'
import { doc, FirestoreErrorCode, setDoc } from 'firebase/firestore'
import {auth, db, storage} from '../../firebaseApp'
import { UserData, getUser } from './useUser'
import { FirebaseError } from 'firebase/app'
import { AuthContext } from '../../context/AuthContext'
import {getDownloadURL, ref, StorageErrorCode, uploadBytes} from "@firebase/storage";

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
  const [error, setError] = useState<FirestoreErrorCode|StorageErrorCode>()
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
        if (!(typeof profile_image === 'string')){
          const storageRef = ref(storage, `users/${user!.uid}/${profile_image.name}`)
          uploadBytes(storageRef, profile_image).then(() => {
            getDownloadURL(storageRef).then((res) => {
              profile_image = res
            })
          }).catch((err) => {
            setError(err.code)
            profile_image = 'https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'
          })
        }
        createNewUser(newUser, username, profile_image as string)
          .then(() => {
            setLoading(false)
            setUser({
              role: 'reader',
              profile_image: profile_image as string,
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

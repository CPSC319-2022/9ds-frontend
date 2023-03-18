import { useState, useEffect } from 'react'
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

export const useAuth = () => {
  const [state, setState] = useState(() => {
    const user = auth.currentUser
    return {
      initializing: !user,
      user,
    }
  })

  const onChange = (user: User | null) => {
    setState({ initializing: false, user })
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(onChange)
    return () => unsubscribe()
  }, [])

  return state
}

const createNewUser = (
  username: string,
  profile_image: string,
): Promise<void> => {
  if (auth.currentUser === null) {
    return Promise.reject('failed_precondition')
  }
  return setDoc(doc(db, 'users', auth.currentUser.uid), {
    role: 'reader',
    username: username,
    profile_image: profile_image,
  })
}

export const useCreateUserEmailPassword = () => {
    const [error, setError] = useState<FirestoreErrorCode>()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<UserData>()

    const createWithEmailAndPasswordWrapper = (
        email: string,
        password: string,
        username: string,
        profile_image: string,
    ) => {
        setLoading(true)
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                createNewUser(username, profile_image)
                    .then(() => {
                        setUser(
                            {role: "reader",
                            profile_image: profile_image,
                            username: username,
                            // eslint-disable-next-line
                            uid: auth.currentUser!.uid}
                        )
                    })
                    .catch((err) => {
                        setError(err)
                    })
            })
            .catch((err) => {
                setError(err.code)
            })
        setLoading(false)
    }

    return { createWithEmailAndPasswordWrapper, error, loading, user }
}

export const useSignInUserEmailPassword = () => {
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<UserData>()

  const signInWithEmailAndPasswordWrapper = (
    email: string,
    password: string,
  ) => {
    setLoading(true)
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        getUser(auth.currentUser === null ? null : auth.currentUser.uid)
          .then((user) => {
            setUser(user)
          })
          .catch((err) => {
            setError(err)
          })
      })
      .catch((err) => {
        setError(err.code)
      })
      setLoading(false)
  }

  return { signInWithEmailAndPasswordWrapper, error, loading, user }
}

export const useSignInWithGoogle = () => {
    const [error, setError] = useState<FirestoreErrorCode>()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<UserData>()

    const provider = new GoogleAuthProvider()

    const signInWithGoogleWrapper = () => {
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
                            profile.name as string,
                            profile.picture as string,
                        )
                            .then(() => {
                                setUser({role: "reader",
                                    profile_image: profile.picture as string,
                                    username: profile.name as string,
                                    // eslint-disable-next-line
                                    uid: auth.currentUser!.uid})
                            })
                            .catch((err) => {
                                setError(err)
                            })
                    }
                } else {
                    getUser(auth.currentUser === null ? null : auth.currentUser.uid)
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
        setLoading(false)
    }
    return { signInWithGoogleWrapper, error, loading, user }
}

export const useForgotPasswordEmail = () => {
  const [error, setError] = useState<FirebaseError>()
  const [loading, setLoading] = useState(false)
    
  const sendEmail = (email: string) => {
    setLoading(true)
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
      })
      setLoading(false)
  }

  return { sendEmail, error, loading }
}

export const useResetCode = () => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const verifyCode = (actionCode: string) => {
    setLoading(true)
    verifyPasswordResetCode(auth, actionCode)
      .then((accountEmail) => {
        setEmail(accountEmail)
      })
      .catch((err) => {
        setError(err)
      })
      setLoading(false)
  }

  return { verifyCode, error, loading, email }
}

export const useNewPassword = () => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)

  const setNewPassword = (actionCode: string, password: string) => {
    setLoading(true)
    confirmPasswordReset(auth, actionCode, password)
      .then(() => {
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
      })
      setLoading(false)
  }

  return { setNewPassword, error, loading }
}

export const useSignOut = () => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [signedOut, setSignedOut] = useState<boolean>()

  const signOutWrapper = () => {
    setLoading(true)
    signOut(auth)
      .then(() => {
        setLoading(false)
        setSignedOut(true)
      })
      .catch((err) => {
        setError(err)
      })
    setLoading(false)
  }

  return { signOutWrapper, error, loading, signedOut }
}

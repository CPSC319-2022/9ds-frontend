import { FirestoreErrorCode } from 'firebase/firestore'
import { useAuth } from 'hooks/firebase/useAuth'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { UserData } from 'types/UserData'
import { getUser } from 'utils/firebase/user'

interface UserState {
  queriedUser: UserData
  loading: boolean
  error?: FirestoreErrorCode
}

const initialState: UserState = {
  queriedUser: {
    role: '',
    profile_image: '',
    username: '',
    uid: '',
  },
  loading: true,
  error: undefined,
}

export const UserContext = createContext<{
  state: UserState
}>({
  state: initialState,
})

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, initializing } = useAuth()
  const [queriedUser, setQueriedUser] = useState<UserData>({
    role: '',
    profile_image: '',
    username: '',
    uid: '',
  })
  const [error, setError] = useState<FirestoreErrorCode>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!initializing) {
      setLoading(true)
      setError(undefined)
      setQueriedUser({
        role: '',
        profile_image: '',
        username: '',
        uid: '',
      })
      getUser(user?.uid ?? null)
        .then((user) => {
          setQueriedUser(user)
          setLoading(false)
        })
        .catch((err: FirestoreErrorCode) => {
          setError(err)
        })
    }
  }, [user, initializing])

  return (
    <UserContext.Provider
      value={{
        state: { queriedUser, loading, error },
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

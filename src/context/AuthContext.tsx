import { User } from 'firebase/auth'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { auth } from '../firebaseApp'

interface AuthState {
  currentUser?: User | null
  initializing: boolean
}

const initialState: AuthState = {
  currentUser: undefined,
  initializing: true,
}

export const AuthContext = createContext<{
  state: AuthState
}>({
  state: initialState,
})

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>()
  const [initializing, setInitializing] = useState(true)

  const onChange = (user: User | null) => {
    setCurrentUser(user)
    setInitializing(!user)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(onChange)
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        state: { currentUser, initializing },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

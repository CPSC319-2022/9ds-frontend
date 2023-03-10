import { AlertColor } from '@mui/material'
import React, { createContext, ReactNode, useReducer } from 'react'

export type NotificationType = AlertColor
export type NotificationActionType = 'close' | NotificationType

interface NotificationState {
  isOpen: boolean
  notificationType?: NotificationType
  message: string
}

const initialState: NotificationState = {
  isOpen: false,
  notificationType: undefined,
  message: '',
}

export const NotificationContext = createContext<{
  state: NotificationState
  dispatch: React.Dispatch<{
    notificationActionType: NotificationActionType
    message?: string
  }>
}>({
  state: initialState,
  dispatch: () => null,
})

const notificationReducer = (
  _state: NotificationState,
  {
    notificationActionType,
    message = '',
  }: { notificationActionType?: NotificationActionType; message?: string },
): NotificationState => {
  if (notificationActionType === 'close') {
    return { isOpen: false, message }
  }
  return { isOpen: true, notificationType: notificationActionType, message }
}

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState)
  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  )
}

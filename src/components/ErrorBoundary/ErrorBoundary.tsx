import React, { ErrorInfo, ReactElement } from 'react'
import {
  NotificationActionType,
  NotificationContext,
} from '../../context/NotificationContext'

interface ErrorBoundaryProps {
  children: ReactElement
}

// Has to be a class component to use componentDidCatch,
// no alternative for function component
export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
  }

  static contextType = NotificationContext

  static getDerivedStateFromError(error: Error) {
    return { errorMessage: error.toString() }
  }

  // eslint-disable-next-line
  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    const { dispatch } = this.context as {
      dispatch: React.Dispatch<{
        notificationActionType: NotificationActionType
        message?: string
      }>
    }
    dispatch({
      notificationActionType: 'error',
      message: error.message,
    })
  }

  render(): React.ReactNode {
    return this.props.children
  }
}

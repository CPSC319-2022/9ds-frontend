import React, { ErrorInfo, ReactElement, ReactNode } from 'react'
import {
  NotificationActionType,
  NotificationContext,
} from '../../context/NotificationContext'

interface ErrorBoundaryProps {
  children: ReactNode
}

// Has to be a class component to use componentDidCatch,
// no alternative for function component
export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
  }

  static contextType = NotificationContext

  static getDerivedStateFromError(_error: Error) {
    return
  }

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

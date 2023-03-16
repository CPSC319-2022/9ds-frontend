import { AlertColor } from '@mui/material'
import { render, screen } from '@testing-library/react'
import { NotificationSnackbar } from '../../components/Snackbar'
import { NotificationContext } from '../../context'


describe('NotificationSnackbar', () => {
  const notification = {
    isOpen: true,
    message: 'Test message',
    notificationType: 'success' as AlertColor | undefined,
  }

  it('renders with the correct message and notification type', () => {
    render(
      <NotificationContext.Provider value={{ state: notification, dispatch: jest.fn() }}>
        <NotificationSnackbar />
      </NotificationContext.Provider>
    )

    const messageElement = screen.getByText(notification.message)
    const snackbarElement = screen.getByRole('alert')

    expect(messageElement).toBeInTheDocument()
    expect(snackbarElement).toHaveClass(`MuiAlert-filledSuccess`)
  })

  it('closes when the close button is clicked', () => {
    const dispatchMock = jest.fn()

    render(
      <NotificationContext.Provider value={{ state: notification, dispatch: dispatchMock }}>
        <NotificationSnackbar />
      </NotificationContext.Provider>
    )

    const closeButton = screen.getByRole('button')

    expect(closeButton).toBeInTheDocument()

    closeButton.click()

    expect(dispatchMock).toHaveBeenCalledTimes(1)
    expect(dispatchMock).toHaveBeenCalledWith({ notificationActionType: 'close' })
  })

  it('has the correct styles', () => {
    render(
      <NotificationContext.Provider value={{ state: notification, dispatch: jest.fn() }}>
        <NotificationSnackbar />
      </NotificationContext.Provider>
    )

    const snackbarElement = screen.getByRole('alert')

    expect(snackbarElement).toHaveStyle(`
      width: 100%;
    `)
  })
})

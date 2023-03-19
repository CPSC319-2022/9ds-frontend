import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { NotificationContext } from '../../context/NotificationContext'
import { useContext, forwardRef, SyntheticEvent } from 'react'

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

export const NotificationSnackbar = () => {
  const { state, dispatch } = useContext(NotificationContext)

  const handleClose = (_?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch({ notificationActionType: 'close' })
  }

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        open={state.isOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        {state.notificationType && (
          <Alert
            onClose={handleClose}
            severity={state.notificationType}
            sx={{ width: '100%' }}
          >
            {state.message}
          </Alert>
        )}
      </Snackbar>
    </Stack>
  )
}

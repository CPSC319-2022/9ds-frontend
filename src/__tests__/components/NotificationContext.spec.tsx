import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { NotificationContext, NotificationProvider } from '../../context'

describe('NotificationContext', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(
      <NotificationProvider>
        <NotificationContext.Consumer>
          {({ state }) => <div data-testid='isOpen'>{state.isOpen}</div>}
        </NotificationContext.Consumer>
      </NotificationProvider>,
    )
    expect(getByTestId('isOpen')).toBeTruthy()
  })
  it('should update state when dispatch is called with notificationActionType', () => {
    const { getByTestId } = render(
      <NotificationProvider>
        <NotificationContext.Consumer>
          {({ state, dispatch }) => (
            <div>
              <button
                data-testid='dispatch-button'
                onClick={() =>
                  dispatch({
                    notificationActionType: 'success',
                    message: 'Test message',
                  })
                }
              >
                Dispatch
              </button>
              <div data-testid='state'>{JSON.stringify(state)}</div>
            </div>
          )}
        </NotificationContext.Consumer>
      </NotificationProvider>,
    )

    const dispatchButton = getByTestId('dispatch-button')
    const state = getByTestId('state')

    expect(state.textContent).toContain('"isOpen":false')
    expect(state.textContent).toContain('"message":""')

    fireEvent.click(dispatchButton)

    expect(state.textContent).toContain('"isOpen":true')
    expect(state.textContent).toContain('"notificationType":"success"')
    expect(state.textContent).toContain('"message":"Test message"')
  })
})

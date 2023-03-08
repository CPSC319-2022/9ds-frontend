import { render, screen } from '@testing-library/react'
import { ConfirmPasswordForm } from '../../components/ConfirmPasswordForm'


describe('ConfirmPasswordForm', () => {
  beforeAll(() => {
    render(
        <ConfirmPasswordForm />
    )
    jest.setTimeout(15000)
  })

  test('style', () => {
    const [title, label, input] = screen.getAllByText("New password")
    expect(title).toBeInTheDocument()
    expect(label).toBeInTheDocument()
    expect(label).toHaveAttribute("data-shrink", "false")
    expect(input).toBeInTheDocument()

    const [confirmLabel, confirmInput] = screen.getAllByText("Confirm password")
    expect(confirmLabel).toBeInTheDocument()
    expect(confirmLabel).toHaveAttribute("data-shrink", "false")
    expect(confirmInput).toBeInTheDocument()

    const [visButtonNew, visButtonConfirm, confirmButton] = screen.getAllByRole("button")
    expect(visButtonNew).toBeEnabled()
    expect(visButtonNew).toBeInTheDocument()

    expect(visButtonConfirm).toBeEnabled()
    expect(visButtonConfirm).toBeInTheDocument()

    expect(confirmButton).toBeEnabled()
    expect(confirmButton).toBeInTheDocument()

  })

})
import { render, screen } from '@testing-library/react'
import { FileUploader } from 'components/FileUploader/FileUploader'
import {
  NotificationProvider,
} from 'context/NotificationContext'
import userEvent from '@testing-library/user-event'

describe('FileUploader', () => {
  const setFileMock = jest.fn()
  beforeEach(() => {
    render(
      <NotificationProvider>
        <FileUploader file={null} setFile={setFileMock} />
      </NotificationProvider>,
    )
    jest.setTimeout(15000)
  })

  test('No file selected', () => {
    expect(screen.getByText('File Unselected')).toBeInTheDocument()
    expect(screen.getByText('UPLOAD')).toBeInTheDocument()
    expect(screen.getByText('RESET')).toBeInTheDocument()
  })

  test('Click reset', () => {
    userEvent.click(screen.getByText('RESET'))
    expect(screen.getByText('File Unselected')).toBeInTheDocument()
  })
  test('Click upload', () => {
    userEvent.click(screen.getByText('UPLOAD'))
    expect(screen.getByText('UPLOAD')).toBeInTheDocument()
  })

  test('File Uploader success', () => {
    const file = new File(['test'], 'filename', { type: 'image/png' })
    const uploader = screen.getByTestId('upload-input')
    userEvent.upload(uploader, file)
    expect(setFileMock).toBeCalledWith(file)
  })

  test('File Uploader failure', () => {
    const file = new File(['a'.repeat(3000001)], 'filename', {
      type: 'image/png',
    })
    const uploader = screen.getByTestId('upload-input')
    userEvent.upload(uploader, file)
    expect(setFileMock).not.toBeCalledWith(file)
  })
})

describe('FileUploader Switch case', () => {
  const setFileMock = jest.fn()
  beforeEach(() => {
    const file = new File(['test'], 'filename', { type: 'image/png' })
    render(
      <NotificationProvider>
        <FileUploader file={file} setFile={setFileMock} />
      </NotificationProvider>,
    )
    jest.setTimeout(15000)
  })
  test('File Selected shown', () => {
    expect(screen.getByText('File Selected')).toBeInTheDocument()
  })
})

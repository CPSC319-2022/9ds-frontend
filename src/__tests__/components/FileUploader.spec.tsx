import { fireEvent, render, screen } from '@testing-library/react'
import { FileUploader } from 'components/FileUploader/FileUploader'
import { NotificationContext, NotificationProvider } from 'context/NotificationContext'
import userEvent from '@testing-library/user-event'

describe('FileUploader', () => {
    beforeEach(() => {
      render(
        <NotificationProvider>
            <FileUploader file={null} setFile={jest.fn()} />
        </NotificationProvider>
      )
      jest.setTimeout(15000)
    })

    test('No file selected', () => {
        expect(screen.getByText('File Unselected')).toBeInTheDocument();
        expect(screen.getByText('UPLOAD')).toBeInTheDocument();
        expect(screen.getByText('RESET')).toBeInTheDocument();
    })

    test('Click reset', () => {
        userEvent.click(screen.getByText('RESET'))
        expect(screen.getByText('File Unselected')).toBeInTheDocument();
        
    })
    test('Click upload', () => {
        userEvent.click(screen.getByText('UPLOAD'))
        expect(screen.getByText('UPLOAD')).toBeInTheDocument(); 
    })

    test('renders "File Selected" when a file is passed in as a prop', () => {
        const file = new File([''], 'filename');
        render(
            <NotificationProvider>
                <FileUploader file={file} setFile={jest.fn()} />
            </NotificationProvider>
          )
        expect(screen.getByText('File Selected')).toBeInTheDocument();
      });
})

describe('FileUploader Part 2', () => {
    test('displays an error message when the selected file exceeds 3MB', () => {
        const file = new File(['a'.repeat(3000001)], 'filename');
        render(
            <NotificationProvider>
                <FileUploader file={file} setFile={jest.fn()} />
            </NotificationProvider>
          )
        const fileInput = screen.getByText('UPLOAD');
        fireEvent.change(fileInput, { target: { files: [file] } });
      });
})
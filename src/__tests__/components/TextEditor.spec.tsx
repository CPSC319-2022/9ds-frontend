import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditorState } from 'draft-js'
import React from 'react'
import { convertToPlainText, TextEditor, TextEditorInfo } from '../../components/TextEditor'

describe('TextEditor', () => {
  beforeEach(() => {
    const editorInfo: TextEditorInfo = {editorState: EditorState.createEmpty(), setEditorState: jest.fn()}
    render(<TextEditor error={false} editorInfo={editorInfo} errorMsg='' />)
    jest.setTimeout(15000)
  })

  test('style/components', () => {
    const title = screen.getByText('Body')
    expect(title).toBeInTheDocument()
    const [boldImg, italicImg, underlineImg] = screen.getAllByRole('img')
    expect(boldImg).toHaveAttribute('src', 'bold.svg')
    expect(boldImg).toBeInTheDocument()
    expect(italicImg).toHaveAttribute('src', 'italic.svg')
    expect(italicImg).toBeInTheDocument()
    expect(underlineImg).toHaveAttribute('src', 'underline.svg')
    expect(underlineImg).toBeInTheDocument()
    const editor = screen.getByLabelText('editor')
    expect(editor).toHaveStyle(
      'outline: none; user-select: text; white-space: pre-wrap; word-wrap: break-word;',
    )
    expect(editor).toBeInTheDocument()
  })

  test("selecting/deselecting", () => {
       const editor = screen.getByLabelText("editor")
       userEvent.click(editor)
       const title = screen.getByText('Body')
       userEvent.click(title)
  })

  })

describe('TextEditor Error State', () => {
    beforeAll(() => {
      const editorInfo: TextEditorInfo = {editorState: EditorState.createEmpty(), setEditorState: jest.fn()}
      render(<TextEditor error={true} editorInfo={editorInfo} errorMsg='Dummy Msg' />)
      jest.setTimeout(15000)
    })
  
    test('Error state', () => {
      const error = screen.getByText('Dummy Msg')
      expect(error).toBeInTheDocument()
    })
  })

describe('TextEditor Focus State', () => {
  beforeEach(() => {
    const setStateMock = jest.fn()
    const useStateMock: any = (useState: any) => [true, setStateMock]
    jest.spyOn(React, 'useState').mockImplementation(useStateMock)
    const editorInfo: TextEditorInfo = {editorState: EditorState.createEmpty(), setEditorState: jest.fn()}
    render(<TextEditor error={false} editorInfo={editorInfo} errorMsg='' />)
    jest.setTimeout(15000)
  })

  test('focus', () => {
    const title = screen.getByText('Body')
    expect(title).toBeInTheDocument()
    const [boldImg, italicImg, underlineImg] = screen.getAllByRole('img')
    expect(boldImg).toHaveAttribute('src', 'bold.svg')
    expect(boldImg).toBeInTheDocument()
    expect(italicImg).toHaveAttribute('src', 'italic.svg')
    expect(italicImg).toBeInTheDocument()
    expect(underlineImg).toHaveAttribute('src', 'underline.svg')
    expect(underlineImg).toBeInTheDocument()
    const editor = screen.getByLabelText('editor')
    expect(editor).toHaveStyle(
      'outline: none; user-select: text; white-space: pre-wrap; word-wrap: break-word;',
    )
    expect(editor).toBeInTheDocument()
  })
})

describe('TextEditor parsing', () => {
    test('Failed Parsing', () => {
      const test = "dummy"
      expect(convertToPlainText(test)).toEqual(test)
    })

    test('Parsing Passed', () => {
        const test = '{"blocks":[{"key":"2t3s5","text":"test","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}'
        expect(convertToPlainText(test)).toEqual('test')
      })
  })

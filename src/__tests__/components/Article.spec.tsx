import { render, screen } from '@testing-library/react'
import { Article } from "../../components/Article";

test('should show article', () => {
  render(<Article size='large'/>)
  // This shows a clear view of the DOM that is useful for getting elements
  // screen.debug()

})

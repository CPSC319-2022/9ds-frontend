import { render, screen } from '@testing-library/react'
import { BuildStep } from 'components/BuildStep'

describe('Build Step', () => {
    test("Option 1", () => {
        render(<BuildStep type="cancel" step={1} />)
        const step = screen.getByTestId('step-heading')
        expect(step).toHaveTextContent('Install Dependencies')
    })
    test("Option 2", () => {
        render(<BuildStep type="cancel" step={2} />)
        const step = screen.getByTestId('step-heading')
        expect(step).toHaveTextContent('Lint')
    })
    test("Option 3", () => {
        render(<BuildStep type="cancel" step={3} />)
        const step = screen.getByTestId('step-heading')
        expect(step).toHaveTextContent('Unit Tests')
    })
    test("Option 4", () => {
        render(<BuildStep type="cancel" step={4} />)
        const step = screen.getByTestId('step-heading')
        expect(step).toHaveTextContent('Dockerize')
    })
    test("Option 5", () => {
        render(<BuildStep type="cancel" step={5} />)
        const step = screen.getByTestId('step-heading')
        expect(step).toHaveTextContent('Send to GCR')
    })
    test("Option 6", () => {
        render(<BuildStep type="cancel" step={6} />)
        const step = screen.getByTestId('step-heading')
        expect(step).toHaveTextContent('Deploy')
    })
    test("Option default", () => {
        render(<BuildStep type="cancel" step={7} />)
        const step = screen.getByTestId('step-heading')
        expect(step).toHaveTextContent('Install Dependencies')
    })
})

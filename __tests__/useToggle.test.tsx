import { fireEvent, render, renderHook } from '@testing-library/react'
import useToggle from 'utils/useToggle'

const T = () => {
  const [status, toggle] = useToggle()

  return (
    <>
      {status && <span>flag</span>}
      <button onClick={toggle}>toggle</button>
    </>
  )
}

describe('useToggle logic', () => {
  it('call hook should return an array with 2 items', () => {
    const {
      result: { current: result }
    } = renderHook(useToggle)
    expect(result instanceof Array).toBeTruthy()
    expect(result.length).toBe(2)
    const [status, toggle] = result
    expect(typeof status).toBe('boolean')
    expect(typeof toggle).toBe('function')
  })
  it('call hook without arg return status should be false', () => {
    const {
      result: {
        current: [status]
      }
    } = renderHook(useToggle)
    expect(status).toBeFalsy()
  })
  it('call hook with true return status should be true', () => {
    const {
      result: {
        current: [status]
      }
    } = renderHook(useToggle, { initialProps: true })
    expect(status).toBeTruthy()
  })
  it('call hook with false return status should be false', () => {
    const {
      result: {
        current: [status]
      }
    } = renderHook(useToggle, { initialProps: false })
    expect(status).toBeFalsy()
  })
  it('call toggle can change status', async () => {
    const { getByRole, queryByText } = render(<T />)
    expect(queryByText('flag')).toBeFalsy()
    const button = getByRole('button')
    expect(button).toHaveTextContent('toggle')
    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    )
    expect(queryByText('flag')).toBeInTheDocument()
  })
  it('recalled hook with same props returned same toggle', () => {
    const {
      result: {
        current: [_, toggle]
      },
      rerender
    } = renderHook(useToggle)
    const temp = toggle
    rerender()
    expect(toggle === temp).toBeTruthy()
  })
})

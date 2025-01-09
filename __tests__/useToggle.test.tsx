import { act, renderHook } from '@testing-library/react'
import useToggle from 'utils/useToggle'

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
    const {
      result,
      result: {
        current: [initStatus, toggle]
      }
    } = renderHook(useToggle)
    await act(async () => toggle())
    expect(!initStatus).toEqual(result.current[0])
  })
  it('recalled hook with same props returned same toggle', () => {
    const {
      result: {
        current: [_, toggle]
      },
      result,
      rerender
    } = renderHook(useToggle)
    rerender()
    expect(toggle).toBe(result.current[1])
  })
})

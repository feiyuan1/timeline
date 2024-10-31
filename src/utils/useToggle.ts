import { useCallback, useMemo, useState } from 'react'

const useToggle = (init?: boolean) => {
  const [status, setStatus] = useState(init || false)

  const toggle = useCallback(() => {
    setStatus(!status)
  }, [status])

  const result = useMemo(
    () => [status, toggle] as const,
    [init, status, toggle]
  )

  return result
}

export default useToggle

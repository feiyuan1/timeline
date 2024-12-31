import { useMemo, useState } from 'react'

const useToggle = (init?: boolean) => {
  const [status, setStatus] = useState(init || false)

  const result = useMemo(
    () =>
      [
        status,
        () => {
          setStatus(!status)
        }
      ] as const,
    [status]
  )

  return result
}

export default useToggle

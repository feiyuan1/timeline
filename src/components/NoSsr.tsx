import { PropsWithChildren, ReactNode, useEffect, useState } from 'react'

type NoSsrProps = PropsWithChildren<{ fallback?: ReactNode }>

const NoSsr = ({ children, fallback = null }: NoSsrProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return fallback
  }

  return children
}

export default NoSsr

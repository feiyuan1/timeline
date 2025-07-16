import { useEffect, useState } from 'react'
import Frame from './frame'

const Screen = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return ''
  }

  return <Frame />
}

export default Screen

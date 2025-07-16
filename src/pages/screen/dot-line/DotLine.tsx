import { useEffect, useRef, useState } from 'react'
import image from './frame-1.png'
import getDotPosition, { DotPoint } from './getDotPosition'

const points = [
  { x: 54, y: 105 },
  { x: 911, y: 482 },
  { x: 489, y: 366 }
]

const DotLine = () => {
  const [isClient, setIsClient] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [dotPositions, setDotPositions] = useState<DotPoint[]>([])

  useEffect(() => {
    if (!isClient) {
      return
    }
    if (!imageRef.current) {
      return
    }

    const image = imageRef.current
    const displaySize = [image.naturalWidth, image.naturalHeight]
    const naturalSize = [1175, 600]
    const result = getDotPosition({
      points,
      naturalSize,
      displaySize
    })
    setDotPositions(result)
  }, [isClient])

  if (!isClient) {
    return ''
  }

  return (
    <div
      style={{ height: '100%', width: '100%', position: 'relative' }}
      // ref={containerRef}
    >
      <img src={image} ref={imageRef} />
      {dotPositions.map(({ x, y }, index) => (
        <div
          key={index}
          style={{
            border: '2px solid black',
            width: '10px',
            height: '10px',
            position: 'absolute',
            top: y + 'px',
            left: x + 'px',
            transform: 'translate(-50%, -50%)'
          }}
        ></div>
      ))}
    </div>
  )
}

export default DotLine

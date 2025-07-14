import { useEffect, useRef, useState } from 'react'
import image from './frame-1.png'
import useDotPosition from './useDotPosition'

const points = [
  { x: 47, y: 100 },
  { x: 904, y: 476 },
  { x: 363, y: 482 }
]

const DotLine = () => {
  const [isClient, setIsClient] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const { points: dotPoints, containerRef } = useDotPosition(points, imageRef)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return ''
  }

  return (
    <div
      style={{ height: '100%', width: '100%', position: 'relative' }}
      // ref={containerRef}
    >
      <img src={image} style={{ height: '600px' }} ref={imageRef} />
      {dotPoints.map(({ x, y }, index) => (
        <div
          key={index}
          style={{
            border: '2px solid black',
            width: '10px',
            height: '10px',
            position: 'absolute',
            top: x + 'px',
            left: y + 'px',
            transform: 'translate(-50%, -50%)'
          }}
        ></div>
      ))}
    </div>
  )
}

export default DotLine

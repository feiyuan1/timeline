import { RefObject, useEffect, useRef } from 'react'

interface DotPoint {
  x: number
  y: number
}

const useDotPosition = (
  points: DotPoint[],
  imageRef: RefObject<HTMLElement>
) => {
  // const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const image = imageRef.current
    if (!image) {
      return
    }
    /**
     * 需要知道图片的：
     * - 上下左右偏移量
     * - 原始尺寸 natural
     * - 实际渲染尺寸 display
     */
    const naturalWidth = image.naturalWidth
    const naturalHeight = image.naturalHeight

    points.forEach((point) => {
      const xPercent = point.x / naturalWidth
      const yPercent = point.y / naturalHeight

      const left = offsetX + xPercent * displayWidth
      const top = offsetY + yPercent * displayHeight

      // point.element.style.left = `${left}px`
      // point.element.style.top = `${top}px`

      // 可选：根据缩放比例调整锚点元素大小
      // const scale = displayWidth / naturalWidth
      // point.element.style.transform = `scale(${scale})`
    })
  }, [points])

  return {
    points: [] as DotPoint[]
    // containerRef
  }
}

export default useDotPosition

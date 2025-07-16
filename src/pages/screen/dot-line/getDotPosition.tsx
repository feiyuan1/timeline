export interface DotPoint {
  x: number
  y: number
}

export type DotAxis = [number, number]

export interface DotPositionProps {
  points: DotPoint[] // 点相对于所在容器左上角的坐标
  naturalSize: DotAxis // 容器的原始尺寸
  displaySize: DotAxis // 容器的实际渲染尺寸
  offsetSize?: DotAxis // 容器的偏移尺寸
}

const getDotPosition = ({
  points,
  naturalSize,
  displaySize,
  offsetSize
}: DotPositionProps): DotPoint[] => {
  /**
   * 需要知道图片的：
   * - 上下左右偏移量
   * - 原始尺寸 natural
   * - 实际渲染尺寸 display
   */
  const [naturalWidth, naturalHeight] = naturalSize
  const [displayWidth, displayHeight] = displaySize
  const [offsetX, offsetY] = offsetSize || [0, 0]

  return points.map((point) => {
    const xPercent = point.x / naturalWidth
    const yPercent = point.y / naturalHeight

    const left = offsetX + xPercent * displayWidth
    const top = offsetY + yPercent * displayHeight

    return { x: left, y: top }
  })
}

export default getDotPosition

import { useCallback, useEffect, useRef } from 'react'

export enum CropType {
  Center = 'center', // 中心裁剪
  None = 'none' // 不裁剪，留白
}

interface FramesAnimationProps {
  preloadFrameCount: number // 预加载的帧数
  frameCount: number // 总帧数
  animationDuration: number // 动画总时长，单位毫秒
  templateFileName: string // 模板文件名，包含 $frameIndex 占位符
  cropType?: CropType // 裁剪类型，默认中心裁剪
}

type DrawSizeType = [number, number, number, number] // [offsetX, offsetY, drawWidth, drawHeight]

const imageContext = require
  .context('./asset', false, /\.(png|jpe?g)$/)
  .keys()
  .map(console.log)

/**
 * 1. 模板文件名中包含 $frameIndex 占位符，且 frameIndex 从 0 开始
 * 2. 每帧播放时长相同
 * 3. 默认中心裁剪，支持不裁剪留白
 */
const useFramesAnimation = ({
  preloadFrameCount,
  frameCount,
  animationDuration,
  templateFileName,
  cropType
}: FramesAnimationProps) => {
  // const imageContext = require.context('./asset', false, /\.(png|jpe?g)$/)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const currentFrameRef = useRef(0)
  const frameDuration = Math.ceil(animationDuration / frameCount)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const drawSizeRef = useRef<DrawSizeType>([0, 0, 0, 0])

  // 初始化 canvas 上下文
  useEffect(() => {
    if (!canvasRef.current) {
      return
    }
    ctxRef.current = canvasRef.current.getContext('2d')
  }, [])

  const loadImage = useCallback((src: string) => {
    // return import(src).then((pngModule: { default: string }) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.src = require(imageContext.find((key) => key === src))
        .default as string
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    })
    // })
  }, [])
  const getFileName = useCallback(
    (index: number) => {
      return `frame-${index + 1}.png`
      // return templateFileName.replace('$frameIndex', String(index + 1))
    },
    [templateFileName]
  )

  const preloadImages = useCallback(async () => {
    if (preloadFrameCount <= 0) {
      return
    }

    const promises = []
    for (let i = 0; i < preloadFrameCount; i++) {
      promises.push(loadImage(getFileName(i)))
    }
    const images = await Promise.all(promises)
    imagesRef.current = images
  }, [loadImage, preloadFrameCount, templateFileName])

  const loadRestImages = useCallback(async () => {
    for (let i = preloadFrameCount; i < frameCount; i++) {
      const image = await loadImage(getFileName(i))
      imagesRef.current = [...imagesRef.current, image]
    }
  }, [loadImage, preloadFrameCount, frameCount, templateFileName])

  const animate = useCallback(() => {
    const ctx = ctxRef.current
    const canvas = canvasRef.current
    if (!ctx || !canvas) {
      return
    }

    const currentFrame = currentFrameRef.current
    const [offsetX, offsetY, drawWidth, drawHeight] = drawSizeRef.current
    if (imagesRef.current[currentFrame].complete) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(imagesRef.current[currentFrame], offsetX, offsetY)
    }

    currentFrameRef.current = (currentFrame + 1) % frameCount
    setTimeout(animate, frameDuration)
  }, [frameCount, frameDuration])

  const drawImageWithCenterCrop = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    containerWidth: number,
    containerHeight: number
  ): DrawSizeType => {
    // 1. 计算图片和容器的宽高比
    const imgAspect = img.width / img.height
    const containerAspect = containerWidth / containerHeight

    let drawWidth, drawHeight, offsetX, offsetY

    // 2. 判断是宽度还是高度需要裁剪
    if (imgAspect > containerAspect) {
      // 图片比容器更宽 → 按高度缩放，裁剪左右两侧
      drawHeight = containerHeight
      drawWidth = drawHeight * imgAspect
      offsetX = -(drawWidth - containerWidth) / 2 // 水平居中偏移
      offsetY = 0
    } else {
      // 图片比容器更高 → 按宽度缩放，裁剪上下两侧
      drawWidth = containerWidth
      drawHeight = drawWidth / imgAspect
      offsetX = 0
      offsetY = -(drawHeight - containerHeight) / 2 // 垂直居中偏移
    }

    return [offsetX, offsetY, drawWidth, drawHeight]
  }

  const handleCrop = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement
    ): DrawSizeType => {
      if (cropType === CropType.Center) {
        return drawImageWithCenterCrop(
          ctx,
          imagesRef.current[0],
          canvas.width,
          canvas.height
        )
      }

      return [0, 0, canvas.width, canvas.height]
    },
    [cropType]
  )

  const getDrawSize = useCallback(() => {
    const ctx = ctxRef.current
    const canvas = canvasRef.current
    if (!ctx || !canvas) {
      return
    }
    drawSizeRef.current = handleCrop(ctx, canvas)
  }, [handleCrop])

  useEffect(() => {
    void preloadImages().then(() => {
      getDrawSize()
      void loadRestImages()
      animate()
    })
  }, [getDrawSize, preloadImages, loadRestImages, animate])

  return {
    canvasRef
  }
}

export default useFramesAnimation

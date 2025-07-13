import useFramesAnimation from './useFramesAnimation'

const frameCount = 155
const animationDuration = 6000

const Frame = () => {
  const { canvasRef } = useFramesAnimation({
    preloadFrameCount: Math.ceil((frameCount / animationDuration) * 1000),
    frameCount,
    animationDuration,
    templateFileName: './asset/frame-$frameIndex.png'
  })

  return (
    <div style={{ height: '100vw', width: '100vw' }}>
      <canvas ref={canvasRef} height="100%" width="100%" />
    </div>
  )
}

export default Frame

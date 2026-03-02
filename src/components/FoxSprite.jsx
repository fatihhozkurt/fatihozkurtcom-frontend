import { useEffect, useRef, useState } from 'react'

function stripWhiteBackground(frame) {
  const { data } = frame

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index]
    const green = data[index + 1]
    const blue = data[index + 2]
    const average = (red + green + blue) / 3
    const spread = Math.max(red, green, blue) - Math.min(red, green, blue)

    if (average > 238 && spread < 18) {
      data[index + 3] = 0
      continue
    }

    if (average > 220 && spread < 24) {
      data[index + 3] = Math.max(0, data[index + 3] - 210)
    }
  }

  return frame
}

export function FoxSprite({ config, active }) {
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const frameRef = useRef(null)
  const animationFrameRef = useRef(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (!active || gone) {
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) {
      return
    }

    const context = canvas.getContext('2d', { willReadFrequently: true })

    if (!context) {
      return
    }

    const renderFrame = () => {
      if (!video.videoWidth || !video.videoHeight) {
        animationFrameRef.current = window.requestAnimationFrame(renderFrame)
        return
      }

      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
      }

      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const frame = context.getImageData(0, 0, canvas.width, canvas.height)
      frameRef.current = stripWhiteBackground(frame)
      context.putImageData(frameRef.current, 0, 0)

      if (!video.paused && !video.ended) {
        animationFrameRef.current = window.requestAnimationFrame(renderFrame)
      }
    }

    const startPlayback = () => {
      video.currentTime = 0
      const playPromise = video.play()
      if (playPromise?.catch) {
        playPromise.catch(() => {})
      }
      renderFrame()
    }

    const handleEnded = () => {
      window.cancelAnimationFrame(animationFrameRef.current)

      if (config.holdOnEnd) {
        renderFrame()
        video.pause()
        return
      }

      setGone(true)
    }

    if (video.readyState >= 2) {
      startPlayback()
    } else {
      video.addEventListener('loadeddata', startPlayback, { once: true })
    }

    video.addEventListener('ended', handleEnded)

    return () => {
      window.cancelAnimationFrame(animationFrameRef.current)
      video.pause()
      video.removeEventListener('ended', handleEnded)
    }
  }, [active, config.holdOnEnd, gone])

  if (!active || gone) {
    return null
  }

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute z-0 hidden opacity-95 md:block ${config.className}`}>
      <canvas ref={canvasRef} className="fox-canvas h-auto w-full select-none" />
      <video ref={videoRef} muted playsInline preload="auto" className="hidden" src={config.source} />
    </div>
  )
}

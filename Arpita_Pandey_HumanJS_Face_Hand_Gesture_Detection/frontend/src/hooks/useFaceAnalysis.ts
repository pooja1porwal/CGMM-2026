// React hook for client-side face detection/landmarks via Human.js.
//
// Runs entirely in the browser against the SAME video element the existing gesture pipeline
// already uses -- no second getUserMedia call, no extra camera permission prompt. Detection runs
// on its own low-rate interval, independent of the ~7 FPS gesture-inference WebSocket loop, so it
// cannot add backpressure or block sign recognition. Only face detector + face mesh models are
// enabled (age/gender/emotion/race/embedding/body/hand/object detection are explicitly disabled)
// -- this app does not perform identity recognition or demographic prediction.
import { useEffect, useRef, useState } from 'react'
import type { Config } from '@vladmandic/human'

export interface FaceAnalysisState {
  loading: boolean
  error: string | null
  faceDetected: boolean
  faceCount: number
}

const INITIAL_STATE: FaceAnalysisState = {
  loading: false,
  error: null,
  faceDetected: false,
  faceCount: 0,
}

// ~4 FPS. Face presence/landmarks don't need to update faster than that to look smooth, and
// keeping this well below the gesture pipeline's ~7 FPS leaves it plenty of CPU headroom.
const DETECTION_INTERVAL_MS = 250

// Self-hosted (see frontend/public/human-models/) rather than Human's default jsDelivr CDN, so a
// faculty demo doesn't depend on external network access.
const HUMAN_CONFIG: Partial<Config> = {
  modelBasePath: '/human-models/',
  cacheSensitivity: 0,
  warmup: 'none',
  debug: false,
  face: {
    enabled: true,
    detector: { enabled: true, maxDetected: 2, rotation: false },
    mesh: { enabled: true },
    iris: { enabled: false },
    description: { enabled: false }, // age/gender/embedding -- not used, by design
    emotion: { enabled: false },
    antispoof: { enabled: false },
    liveness: { enabled: false },
    gear: { enabled: false },
    attention: { enabled: false },
  },
  body: { enabled: false },
  hand: { enabled: false }, // hand tracking already handled server-side by the MediaPipe pipeline
  object: { enabled: false },
  gesture: { enabled: false },
  segmentation: { enabled: false },
}

export function useFaceAnalysis(
  videoRef: React.RefObject<HTMLVideoElement>,
  overlayCanvasRef: React.RefObject<HTMLCanvasElement>,
  active: boolean,
  showLandmarks: boolean
): FaceAnalysisState {
  const [state, setState] = useState<FaceAnalysisState>(INITIAL_STATE)
  const stateRef = useRef(state)
  const showLandmarksRef = useRef(showLandmarks)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    showLandmarksRef.current = showLandmarks
  }, [showLandmarks])

  // Only depends on `active` (plus the two stable refs) -- toggling landmarks must NOT reload
  // Human.js or restart detection, it only changes what the draw call renders each tick.
  useEffect(() => {
    if (!active) {
      setState(INITIAL_STATE)
      return
    }

    const overlayCanvas = overlayCanvasRef.current
    let cancelled = false
    let intervalId: ReturnType<typeof setInterval> | null = null

    const start = async () => {
      setState((s) => ({ ...s, loading: true, error: null }))
      try {
        const { default: Human } = await import('@vladmandic/human')
        if (cancelled) return
        const human = new Human(HUMAN_CONFIG)
        await human.load()
        if (cancelled) return
        setState((s) => ({ ...s, loading: false }))

        intervalId = setInterval(() => {
          const video = videoRef.current
          if (!video || video.readyState < 2) return

          human
            .detect(video)
            .then((result) => {
              if (cancelled) return
              const faces = result.face || []
              const detected = faces.length > 0
              const count = faces.length
              if (detected !== stateRef.current.faceDetected || count !== stateRef.current.faceCount) {
                setState((s) => ({ ...s, faceDetected: detected, faceCount: count, error: null }))
              }

              // Drawing failures (e.g. an incomplete canvas 2D context in some test/browser
              // environments) must never be treated as a detection failure -- detection already
              // succeeded above. Isolate the overlay drawing so it degrades silently.
              try {
                const canvas = overlayCanvasRef.current
                if (!canvas) return
                if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth
                if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight
                const ctx = canvas.getContext('2d')
                if (!ctx) return
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                human.draw.face(canvas, faces, {
                  drawBoxes: true,
                  drawPoints: showLandmarksRef.current,
                  drawLabels: false,
                  drawPolygons: false,
                  drawGaze: false,
                  drawAttention: false,
                })
              } catch {
                // Overlay rendering is best-effort only; face status text still reflects reality.
              }
            })
            .catch((err: unknown) => {
              if (!cancelled) {
                setState((s) => ({ ...s, error: (err as Error).message }))
              }
            })
        }, DETECTION_INTERVAL_MS)
      } catch (err) {
        if (!cancelled) {
          setState({ ...INITIAL_STATE, loading: false, error: (err as Error).message })
        }
      }
    }

    start()

    return () => {
      cancelled = true
      if (intervalId) clearInterval(intervalId)
      const ctx = overlayCanvas?.getContext('2d')
      ctx?.clearRect(0, 0, overlayCanvas?.width ?? 0, overlayCanvas?.height ?? 0)
      setState(INITIAL_STATE)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- videoRef/overlayCanvasRef are stable ref objects, read fresh inside the interval tick
  }, [active])

  return state
}

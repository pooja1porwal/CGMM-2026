// Camera Panel component.
import { useEffect, useRef } from 'react'
import { useCamera } from '../hooks/useCamera'
import { useFaceAnalysis, FaceAnalysisState } from '../hooks/useFaceAnalysis'
import './CameraPanel.css'

// ~7 FPS. 10 FPS (100ms) is more than needed for stable-sign detection and adds unnecessary
// CPU/network pressure on the Render free-tier instance; the framePending backpressure in
// wsService already caps the *effective* rate to whatever the server can keep up with, so this
// is just a conservative upper bound on the request rate.
const FRAME_INTERVAL_MS = 143

interface CameraPanelProps {
  onFrameCapture: (frameBase64: string) => void
  onActiveChange: (active: boolean) => void
  onFaceStateChange: (state: FaceAnalysisState) => void
  showFaceLandmarks: boolean
}

export function CameraPanel({
  onFrameCapture,
  onActiveChange,
  onFaceStateChange,
  showFaceLandmarks,
}: CameraPanelProps) {
  const { videoRef, canvasRef, isActive, error, permission, startCamera, stopCamera, captureFrame } =
    useCamera()
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)

  // Face analysis runs against this same video element -- no second camera stream. It has its
  // own low-rate interval (see useFaceAnalysis) so it cannot slow down gesture inference below.
  const faceState = useFaceAnalysis(videoRef, overlayCanvasRef, isActive, showFaceLandmarks)

  useEffect(() => {
    onFaceStateChange(faceState)
  }, [faceState, onFaceStateChange])

  useEffect(() => {
    onActiveChange(isActive)
    if (isActive) {
      const interval = setInterval(() => {
        const frame = captureFrame()
        if (frame) {
          onFrameCapture(frame)
        }
      }, FRAME_INTERVAL_MS)

      return () => clearInterval(interval)
    }
  }, [isActive, captureFrame, onFrameCapture, onActiveChange])

  const handleStart = async () => {
    await startCamera()
  }

  const handleStop = () => {
    stopCamera()
  }

  return (
    <div className="camera-panel">
      <div className="camera-container">
        {permission === 'denied' && (
          <div className="error-message">
            <p>Camera permission denied. Please enable camera access to continue.</p>
          </div>
        )}

        {permission !== 'denied' && !isActive && (
          <div className="placeholder">
            <p>📹 Camera Inactive</p>
            <p>Click "Start Camera" to begin</p>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          aria-label="Live camera preview"
          className={`video-element ${isActive ? '' : 'video-hidden'}`}
        />

        <canvas
          ref={overlayCanvasRef}
          aria-label="Face detection overlay"
          className="face-overlay-canvas"
        />

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div className="camera-controls">
        {!isActive ? (
          <button className="btn btn-primary" onClick={handleStart}>
            ▶ Start Camera
          </button>
        ) : (
          <button className="btn btn-danger" onClick={handleStop}>
            ⏹ Stop Camera
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  )
}

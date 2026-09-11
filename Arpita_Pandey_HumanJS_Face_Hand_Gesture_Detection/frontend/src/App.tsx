// Main App component.
import { useCallback, useEffect, useState } from 'react'
import { Header } from './components/Header'
import { CameraPanel } from './components/CameraPanel'
import { HumanAnalysisPanel } from './components/HumanAnalysisPanel'
import { AboutProject } from './components/AboutProject'
import { TranslationPanel } from './components/TranslationPanel'
import { StatusBadge } from './components/StatusBadge'
import { usePrediction } from './hooks/usePrediction'
import { FaceAnalysisState } from './hooks/useFaceAnalysis'
import { getHealth } from './services/api'
import './App.css'

const INITIAL_FACE_STATE: FaceAnalysisState = {
  loading: false,
  error: null,
  faceDetected: false,
  faceCount: 0,
}

function App() {
  const [isActive, setIsActive] = useState(false)
  const { prediction, wsStatus, sendFrame, connect, disconnect } = usePrediction()
  const [modelLoaded, setModelLoaded] = useState(false)
  const [devMode, setDevMode] = useState(false)
  const [faceState, setFaceState] = useState<FaceAnalysisState>(INITIAL_FACE_STATE)
  const [showFaceLandmarks, setShowFaceLandmarks] = useState(false)

  // Runs once on mount. Separated from the camera/WebSocket effect below so it is never
  // re-triggered by camera state changes or prediction-driven re-renders.
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await getHealth()
        setModelLoaded(health.model_loaded)
      } catch (error) {
        console.error('Health check failed:', error)
      }
    }

    checkHealth()
  }, [])

  // connect/disconnect are stable (useCallback in usePrediction), so this effect only re-runs
  // when the camera is actually started/stopped or the WebSocket status actually changes.
  useEffect(() => {
    if (isActive && wsStatus === 'disconnected') {
      connect()
    }

    if (!isActive && wsStatus === 'connected') {
      disconnect()
    }
  }, [isActive, wsStatus, connect, disconnect])

  // Depends only on wsStatus/sendFrame/devMode (all stable or rarely-changing), not on
  // `prediction`, so CameraPanel's frame-capture interval is not torn down on every prediction.
  const handleFrameCapture = useCallback(
    (frameBase64: string) => {
      if (wsStatus === 'connected') {
        sendFrame(frameBase64, devMode)
      }
    },
    [wsStatus, sendFrame, devMode]
  )

  const toggleDevMode = useCallback(() => {
    setDevMode((prev) => !prev)
  }, [])

  const toggleFaceLandmarks = useCallback(() => {
    setShowFaceLandmarks((prev) => !prev)
  }, [])

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <div className="container">
          <StatusBadge wsStatus={wsStatus} />

          <div className="layout">
            <div className="panel-left">
              <CameraPanel
                onFrameCapture={handleFrameCapture}
                onActiveChange={setIsActive}
                onFaceStateChange={setFaceState}
                showFaceLandmarks={showFaceLandmarks}
              />
            </div>

            <div className="panel-right">
              <HumanAnalysisPanel
                faceState={faceState}
                showFaceLandmarks={showFaceLandmarks}
                onToggleFaceLandmarks={toggleFaceLandmarks}
                prediction={prediction}
                modelLoaded={modelLoaded}
                devMode={devMode}
                onToggleDevMode={toggleDevMode}
              />
            </div>
          </div>

          <TranslationPanel prediction={prediction} />

          <AboutProject />
        </div>
      </main>

      <footer className="footer">
        <p>
          SignSpeak AI v1.0.0 | Real-Time ISL Recognition |{' '}
          <a href="#privacy">Privacy Policy</a>
        </p>
      </footer>
    </div>
  )
}

export default App

// Unified Face + Hands + Gesture status panel.
//
// The Hands/Gesture section reuses PredictionCard as-is (unchanged, still independently tested)
// so the existing sign-recognition UI/behavior is fully preserved; this component only adds the
// Face section on top and groups everything under one "Human Analysis" heading.
import { FaceAnalysisState } from '../hooks/useFaceAnalysis'
import { PredictionEvent } from '../types/api'
import { PredictionCard } from './PredictionCard'
import './HumanAnalysisPanel.css'

interface HumanAnalysisPanelProps {
  faceState: FaceAnalysisState
  showFaceLandmarks: boolean
  onToggleFaceLandmarks: () => void
  prediction: PredictionEvent | null
  modelLoaded: boolean
  devMode: boolean
  onToggleDevMode: () => void
}

export function HumanAnalysisPanel({
  faceState,
  showFaceLandmarks,
  onToggleFaceLandmarks,
  prediction,
  modelLoaded,
  devMode,
  onToggleDevMode,
}: HumanAnalysisPanelProps) {
  const landmarksActive = showFaceLandmarks && faceState.faceDetected

  return (
    <div className="human-analysis-panel">
      <h2>Human Analysis</h2>

      <section className="face-section" aria-label="Face analysis">
        <h3>Face</h3>
        {faceState.error ? (
          <p className="face-status face-status-warning">Face analysis unavailable</p>
        ) : faceState.loading ? (
          <p className="face-status">Loading face analysis...</p>
        ) : faceState.faceDetected ? (
          <p className="face-status face-status-ok">
            ✓ Face detected{faceState.faceCount > 1 ? ` (${faceState.faceCount})` : ''}
          </p>
        ) : (
          <p className="face-status">Face: Not detected</p>
        )}
        {landmarksActive && <p className="face-status face-status-ok">✓ Face landmarks active</p>}

        <label className="landmarks-toggle">
          <input
            type="checkbox"
            checked={showFaceLandmarks}
            onChange={onToggleFaceLandmarks}
            disabled={faceState.loading || Boolean(faceState.error)}
          />
          Show face landmarks
        </label>
      </section>

      <PredictionCard
        prediction={prediction}
        modelLoaded={modelLoaded}
        devMode={devMode}
        onToggleDevMode={onToggleDevMode}
      />
    </div>
  )
}

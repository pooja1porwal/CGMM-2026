// Prediction Card component.
import { PredictionEvent } from '../types/api'
import './PredictionCard.css'

interface PredictionCardProps {
  prediction: PredictionEvent | null
  modelLoaded: boolean
  devMode?: boolean
  onToggleDevMode?: () => void
}

export function PredictionCard({
  prediction,
  modelLoaded,
  devMode = false,
  onToggleDevMode,
}: PredictionCardProps) {
  if (!modelLoaded) {
    return (
      <div className="prediction-card">
        <div className="card-section">
          <h3>Status</h3>
          <p className="status-error">Model Not Loaded</p>
          <p className="status-hint">Inference is unavailable</p>
        </div>
      </div>
    )
  }

  let statusText = 'Waiting...'
  let statusClass = 'status-waiting'
  let statusHint = ''
  let signDisplay = '-'
  let confidenceDisplay = '-'
  let committed = false

  if (!prediction) {
    statusText = 'No prediction'
  } else if (prediction.type === 'no_hand') {
    statusText = 'No hand detected'
    statusClass = 'status-warning'
    statusHint = 'Show your hand to the camera'
  } else if (prediction.type === 'error' || prediction.type === 'model_unavailable') {
    statusText = prediction.message || 'Error'
    statusClass = 'status-error'
  } else if (prediction.type === 'low_confidence') {
    // Still show the raw sign/confidence so the user can see the classifier is reading
    // *something* -- it just isn't confident/stable enough to commit yet.
    signDisplay = prediction.sign || '-'
    confidenceDisplay =
      prediction.confidence != null ? `${(prediction.confidence * 100).toFixed(0)}%` : '-'
    statusText = 'Low Confidence — hold steady'
    statusClass = 'status-warning'
    statusHint = 'Hold sign steady...'
  } else if (prediction.type === 'prediction') {
    signDisplay = prediction.sign || '-'
    confidenceDisplay =
      prediction.confidence != null ? `${(prediction.confidence * 100).toFixed(0)}%` : '-'
    committed = Boolean(prediction.commit)

    if (prediction.stable) {
      statusText = 'Stable'
      statusClass = 'status-stable'
    } else {
      statusText = 'Processing...'
      statusClass = 'status-processing'
      statusHint = 'Hold sign steady...'
    }
  }

  return (
    <div className="prediction-card">
      {onToggleDevMode && (
        <div className="dev-toggle">
          <label>
            <input type="checkbox" checked={devMode} onChange={onToggleDevMode} />
            Developer mode
          </label>
        </div>
      )}

      <div className="card-section">
        <h3>Detected Sign</h3>
        <div className="sign-display">{signDisplay}</div>
        {committed && <p className="commit-badge">✓ Added to sentence</p>}
      </div>

      <div className="card-section">
        <h3>Confidence</h3>
        <div className="confidence-bar">
          <div
            className="confidence-fill"
            style={{
              width: `${Math.min(parseFloat(confidenceDisplay) || 0, 100)}%`,
            }}
          />
        </div>
        <p className="confidence-value">{confidenceDisplay}</p>
      </div>

      <div className="card-section">
        <h3>Status</h3>
        <p className={`status-text ${statusClass}`}>{statusText}</p>
        {statusHint && <p className="status-hint-text">{statusHint}</p>}
        {prediction?.hands_detected !== undefined && (
          <p className="hands-info">Hands: {prediction.hands_detected}</p>
        )}
      </div>

      {devMode && prediction && (prediction.handedness || prediction.top_k) && (
        <div className="card-section dev-diagnostics">
          <h3>Developer Diagnostics</h3>
          {prediction.handedness && (
            <p className="dev-line">
              Handedness: {prediction.handedness.length ? prediction.handedness.join(', ') : 'none'}
            </p>
          )}
          {prediction.top_k && prediction.top_k.length > 0 && (
            <ul className="dev-topk">
              {prediction.top_k.map((entry) => (
                <li key={entry.sign}>
                  {entry.sign}: {(entry.confidence * 100).toFixed(1)}%
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

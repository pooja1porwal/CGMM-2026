// TypeScript types for the application.

export interface HealthResponse {
  status: string
  model_loaded: boolean
  model_version?: string
  database: string
}

export interface ModelInfo {
  version: string
  algorithm: string
  feature_dimension: number
  supported_labels: string[]
  metrics: Record<string, number>
}

export interface TopPrediction {
  sign: string
  confidence: number
}

export interface PredictionEvent {
  type: 'prediction' | 'no_hand' | 'low_confidence' | 'model_unavailable' | 'error'
  sign?: string
  confidence?: number
  stable?: boolean
  commit?: boolean
  hands_detected?: number
  timestamp?: string
  message?: string
  // Developer-mode diagnostics, only populated when a frame was sent with debug=true.
  handedness?: string[] | null
  top_k?: TopPrediction[] | null
}

export interface TranslationHistory {
  id: number
  text: string
  created_at: string
  model_version?: string
}

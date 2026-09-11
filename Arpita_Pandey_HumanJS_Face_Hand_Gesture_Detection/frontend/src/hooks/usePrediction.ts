// React hook for WebSocket predictions.
import { useCallback, useEffect, useState } from 'react'
import { PredictionEvent } from '../types/api'
import { wsService } from '../services/websocket'

export function usePrediction() {
  const [prediction, setPrediction] = useState<PredictionEvent | null>(null)
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>(
    'disconnected'
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribeMessage = wsService.onMessage((event) => {
      setPrediction(event)
      if (event.type === 'error') {
        setError(event.message || 'Unknown error')
      }
    })

    const unsubscribeStateChange = wsService.onStateChange((state) => {
      setWsStatus(state)
      if (state === 'disconnected') {
        setError('Disconnected from server')
      } else if (state === 'connected') {
        setError(null)
      }
    })

    return () => {
      unsubscribeMessage()
      unsubscribeStateChange()
    }
  }, [])

  // Stable references: wsService is a module-level singleton, so these never need to change
  // identity. Keeping them stable prevents effects/callbacks downstream (e.g. the camera frame
  // interval) from being torn down and recreated on every prediction/render.
  const sendFrame = useCallback((frameBase64: string, debug = false) => {
    wsService.sendFrame(frameBase64, debug)
  }, [])

  const connect = useCallback(async () => {
    try {
      setError(null)
      await wsService.connect()
    } catch (err) {
      setError((err as Error).message)
    }
  }, [])

  const disconnect = useCallback(() => {
    wsService.disconnect()
  }, [])

  return {
    prediction,
    wsStatus,
    error,
    sendFrame,
    connect,
    disconnect,
  }
}

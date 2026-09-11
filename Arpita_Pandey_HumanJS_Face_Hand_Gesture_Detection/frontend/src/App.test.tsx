import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import * as api from './services/api'

type MessageHandler = (event: unknown) => void
type StateHandler = (state: 'connecting' | 'connected' | 'disconnected') => void

const messageHandlers: MessageHandler[] = []
const stateHandlers: StateHandler[] = []

vi.mock('./services/websocket', () => ({
  wsService: {
    onMessage: (handler: MessageHandler) => {
      messageHandlers.push(handler)
      return () => {
        const idx = messageHandlers.indexOf(handler)
        if (idx >= 0) messageHandlers.splice(idx, 1)
      }
    },
    onStateChange: (handler: StateHandler) => {
      stateHandlers.push(handler)
      return () => {
        const idx = stateHandlers.indexOf(handler)
        if (idx >= 0) stateHandlers.splice(idx, 1)
      }
    },
    sendFrame: vi.fn(),
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn(),
    getState: () => 'disconnected' as const,
    isConnected: () => false,
  },
}))

function emitMessage(event: unknown) {
  messageHandlers.forEach((h) => h(event))
}

describe('App health check', () => {
  beforeEach(() => {
    messageHandlers.length = 0
    stateHandlers.length = 0
    vi.spyOn(api, 'getHealth').mockResolvedValue({
      status: 'ok',
      model_loaded: true,
      model_version: '1.0.0-realsign',
      database: 'ok',
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('is not re-triggered when internal state updates cause App to re-render', async () => {
    await act(async () => {
      render(<App />)
      await Promise.resolve()
    })

    const callsAfterMount = vi.mocked(api.getHealth).mock.calls.length
    expect(callsAfterMount).toBeGreaterThan(0)

    // Simulate several incoming WebSocket predictions, each of which updates App's
    // `prediction` state and re-renders it -- this used to re-run the health-check effect.
    await act(async () => {
      emitMessage({ type: 'no_hand' })
      emitMessage({ type: 'prediction', sign: 'A', confidence: 0.9, stable: true, commit: false })
      emitMessage({ type: 'prediction', sign: 'A', confidence: 0.9, stable: true, commit: true })
      await Promise.resolve()
    })

    expect(vi.mocked(api.getHealth).mock.calls.length).toBe(callsAfterMount)
  })
})

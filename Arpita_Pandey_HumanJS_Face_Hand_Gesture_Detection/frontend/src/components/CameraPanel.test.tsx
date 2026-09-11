import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CameraPanel } from './CameraPanel'
import * as useCameraModule from '../hooks/useCamera'
import * as useFaceAnalysisModule from '../hooks/useFaceAnalysis'

vi.mock('../hooks/useCamera')
vi.mock('../hooks/useFaceAnalysis')

function mockActiveCamera(captureFrame = vi.fn(() => 'frame-data')) {
  vi.mocked(useCameraModule.useCamera).mockReturnValue({
    videoRef: { current: null },
    canvasRef: { current: null },
    isActive: true,
    error: null,
    permission: 'granted',
    startCamera: vi.fn(),
    stopCamera: vi.fn(),
    captureFrame,
  })
}

const noopFaceProps = { onFaceStateChange: () => {}, showFaceLandmarks: false }

describe('CameraPanel frame loop stability', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.mocked(useFaceAnalysisModule.useFaceAnalysis).mockReturnValue({
      loading: false,
      error: null,
      faceDetected: false,
      faceCount: 0,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('does not tear down and recreate the frame interval when callbacks are stable', () => {
    mockActiveCamera()
    const onFrameCapture = vi.fn()
    const onActiveChange = vi.fn()
    const clearSpy = vi.spyOn(global, 'clearInterval')

    const { rerender } = render(
      <CameraPanel onFrameCapture={onFrameCapture} onActiveChange={onActiveChange} {...noopFaceProps} />
    )

    vi.advanceTimersByTime(1000)
    const callsAfterFirstSecond = onFrameCapture.mock.calls.length
    expect(callsAfterFirstSecond).toBeGreaterThan(0)

    // Re-render repeatedly with the SAME onFrameCapture/onActiveChange references, simulating
    // parent re-renders driven by unrelated state (e.g. a new prediction arriving).
    for (let i = 0; i < 5; i++) {
      rerender(
        <CameraPanel onFrameCapture={onFrameCapture} onActiveChange={onActiveChange} {...noopFaceProps} />
      )
    }

    expect(clearSpy).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1000)
    expect(onFrameCapture.mock.calls.length).toBeGreaterThan(callsAfterFirstSecond)
  })

  it('does restart the interval when a callback identity genuinely changes', () => {
    mockActiveCamera()
    const onActiveChange = vi.fn()
    const clearSpy = vi.spyOn(global, 'clearInterval')

    const { rerender } = render(
      <CameraPanel onFrameCapture={vi.fn()} onActiveChange={onActiveChange} {...noopFaceProps} />
    )

    rerender(<CameraPanel onFrameCapture={vi.fn()} onActiveChange={onActiveChange} {...noopFaceProps} />)

    expect(clearSpy).toHaveBeenCalled()
  })

  it('reports face analysis state to the parent via onFaceStateChange', () => {
    mockActiveCamera()
    vi.mocked(useFaceAnalysisModule.useFaceAnalysis).mockReturnValue({
      loading: false,
      error: null,
      faceDetected: true,
      faceCount: 1,
    })
    const onFaceStateChange = vi.fn()

    render(
      <CameraPanel
        onFrameCapture={vi.fn()}
        onActiveChange={vi.fn()}
        onFaceStateChange={onFaceStateChange}
        showFaceLandmarks={false}
      />
    )

    expect(onFaceStateChange).toHaveBeenCalledWith(
      expect.objectContaining({ faceDetected: true, faceCount: 1 })
    )
  })
})

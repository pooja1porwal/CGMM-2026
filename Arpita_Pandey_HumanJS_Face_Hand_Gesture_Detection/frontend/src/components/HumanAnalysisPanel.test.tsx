import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HumanAnalysisPanel } from './HumanAnalysisPanel'

const baseFaceState = { loading: false, error: null, faceDetected: false, faceCount: 0 }

describe('HumanAnalysisPanel', () => {
  it('shows the no-face state', () => {
    render(
      <HumanAnalysisPanel
        faceState={baseFaceState}
        showFaceLandmarks={false}
        onToggleFaceLandmarks={vi.fn()}
        prediction={null}
        modelLoaded
        devMode={false}
        onToggleDevMode={vi.fn()}
      />
    )
    expect(screen.getByText('Face: Not detected')).toBeDefined()
  })

  it('shows the face-detected state', () => {
    render(
      <HumanAnalysisPanel
        faceState={{ ...baseFaceState, faceDetected: true, faceCount: 1 }}
        showFaceLandmarks={false}
        onToggleFaceLandmarks={vi.fn()}
        prediction={null}
        modelLoaded
        devMode={false}
        onToggleDevMode={vi.fn()}
      />
    )
    expect(screen.getByText(/Face detected/)).toBeDefined()
  })

  it('shows landmarks active only when both detected and toggled on', () => {
    const { rerender } = render(
      <HumanAnalysisPanel
        faceState={{ ...baseFaceState, faceDetected: true, faceCount: 1 }}
        showFaceLandmarks={false}
        onToggleFaceLandmarks={vi.fn()}
        prediction={null}
        modelLoaded
        devMode={false}
        onToggleDevMode={vi.fn()}
      />
    )
    expect(screen.queryByText(/Face landmarks active/)).toBeNull()

    rerender(
      <HumanAnalysisPanel
        faceState={{ ...baseFaceState, faceDetected: true, faceCount: 1 }}
        showFaceLandmarks={true}
        onToggleFaceLandmarks={vi.fn()}
        prediction={null}
        modelLoaded
        devMode={false}
        onToggleDevMode={vi.fn()}
      />
    )
    expect(screen.getByText(/Face landmarks active/)).toBeDefined()
  })

  it('calls onToggleFaceLandmarks when the checkbox is clicked', () => {
    const onToggleFaceLandmarks = vi.fn()
    render(
      <HumanAnalysisPanel
        faceState={baseFaceState}
        showFaceLandmarks={false}
        onToggleFaceLandmarks={onToggleFaceLandmarks}
        prediction={null}
        modelLoaded
        devMode={false}
        onToggleDevMode={vi.fn()}
      />
    )
    fireEvent.click(screen.getByRole('checkbox', { name: /Show face landmarks/ }))
    expect(onToggleFaceLandmarks).toHaveBeenCalledTimes(1)
  })

  it('surfaces a graceful message when face analysis errors out', () => {
    render(
      <HumanAnalysisPanel
        faceState={{ ...baseFaceState, error: 'webgl unavailable' }}
        showFaceLandmarks={false}
        onToggleFaceLandmarks={vi.fn()}
        prediction={null}
        modelLoaded
        devMode={false}
        onToggleDevMode={vi.fn()}
      />
    )
    expect(screen.getByText('Face analysis unavailable')).toBeDefined()
    expect(screen.getByRole('checkbox', { name: /Show face landmarks/ })).toHaveProperty('disabled', true)
  })

  it('still renders hands/gesture info from the existing PredictionCard', () => {
    render(
      <HumanAnalysisPanel
        faceState={baseFaceState}
        showFaceLandmarks={false}
        onToggleFaceLandmarks={vi.fn()}
        prediction={{ type: 'prediction', sign: 'B', confidence: 0.87, stable: true, commit: true, hands_detected: 2 }}
        modelLoaded
        devMode={false}
        onToggleDevMode={vi.fn()}
      />
    )
    expect(screen.getByText('B')).toBeDefined()
    expect(screen.getByText('87%')).toBeDefined()
    expect(screen.getByText('Hands: 2')).toBeDefined()
  })
})

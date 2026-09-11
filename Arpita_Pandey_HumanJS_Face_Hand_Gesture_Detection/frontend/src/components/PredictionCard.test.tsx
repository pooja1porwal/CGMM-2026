import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PredictionCard } from './PredictionCard'

describe('PredictionCard', () => {
  it('shows an explicit model unavailable state', () => {
    render(<PredictionCard prediction={null} modelLoaded={false} />)
    expect(screen.getByText('Model Not Loaded')).toBeDefined()
  })

  it('renders sign, confidence, hand count and stability', () => {
    render(<PredictionCard modelLoaded prediction={{ type: 'prediction', sign: 'B', confidence: 0.87, stable: true, commit: true, hands_detected: 2 }} />)
    expect(screen.getByText('B')).toBeDefined()
    expect(screen.getByText('87%')).toBeDefined()
    expect(screen.getByText('Stable')).toBeDefined()
    expect(screen.getByText('Hands: 2')).toBeDefined()
  })

  it('shows the raw predicted sign and confidence even when below the commit threshold', () => {
    render(
      <PredictionCard
        modelLoaded
        prediction={{ type: 'low_confidence', sign: 'I', confidence: 0.4496, hands_detected: 1 }}
      />
    )
    expect(screen.getByText('I')).toBeDefined()
    expect(screen.getByText('45%')).toBeDefined()
    expect(screen.getByText(/Low Confidence/)).toBeDefined()
    expect(screen.getByText('Hands: 1')).toBeDefined()
  })

  it('shows developer diagnostics (handedness, top-3) only in developer mode', () => {
    const prediction = {
      type: 'prediction' as const,
      sign: 'A',
      confidence: 0.92,
      stable: true,
      commit: true,
      hands_detected: 1,
      handedness: ['Right'],
      top_k: [
        { sign: 'A', confidence: 0.92 },
        { sign: 'S', confidence: 0.05 },
      ],
    }

    const { rerender } = render(<PredictionCard modelLoaded prediction={prediction} devMode={false} />)
    expect(screen.queryByText(/Handedness/)).toBeNull()

    rerender(<PredictionCard modelLoaded prediction={prediction} devMode={true} />)
    expect(screen.getByText(/Handedness: Right/)).toBeDefined()
    expect(screen.getByText(/A: 92.0%/)).toBeDefined()
  })
})

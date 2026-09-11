import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFaceAnalysis } from './useFaceAnalysis'

const { HumanConstructor, load, detect, drawFace } = vi.hoisted(() => {
  const load = vi.fn().mockResolvedValue(undefined)
  const detect = vi.fn()
  const drawFace = vi.fn()
  // Must be a real constructible function (not an arrow function) since the hook calls `new Human(...)`.
  const HumanConstructor = vi.fn().mockImplementation(function () {
    return { load, detect, draw: { face: drawFace } }
  })
  return { HumanConstructor, load, detect, drawFace }
})

vi.mock('@vladmandic/human', () => ({ default: HumanConstructor }))

function fakeVideo(): HTMLVideoElement {
  return { readyState: 4, videoWidth: 640, videoHeight: 480 } as unknown as HTMLVideoElement
}

function fakeCanvas(): HTMLCanvasElement {
  const ctx = { clearRect: vi.fn() }
  return {
    width: 0,
    height: 0,
    getContext: () => ctx,
  } as unknown as HTMLCanvasElement
}

// Real (not fake) timers deliberately: this hook's setup goes through a dynamic import(), whose
// microtask/macrotask scheduling under Vitest's fake timers is not reliably controllable. Every
// mock here resolves near-instantly, so short real waits are fast and far more robust.
async function wait(ms: number) {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms))
  })
}

describe('useFaceAnalysis', () => {
  beforeEach(() => {
    HumanConstructor.mockClear()
    load.mockClear()
    detect.mockClear()
    drawFace.mockClear()
    detect.mockResolvedValue({ face: [] })
  })

  afterEach(() => {
    // This project doesn't configure global RTL auto-cleanup, so an un-unmounted renderHook
    // instance from a previous test would keep its interval alive and pollute the shared spies
    // (HumanConstructor/load/detect) used by later tests in this file.
    cleanup()
    // clearAllMocks (not restoreAllMocks) -- restoreAllMocks would wipe out the mockImplementation
    // set once in vi.hoisted() above, since a bare vi.fn() has no "original" to restore to.
    vi.clearAllMocks()
  })

  it('does nothing while inactive', async () => {
    const videoRef = { current: fakeVideo() }
    const canvasRef = { current: fakeCanvas() }
    const { result } = renderHook(() => useFaceAnalysis(videoRef, canvasRef, false, false))
    await wait(10)

    expect(result.current).toEqual({ loading: false, error: null, faceDetected: false, faceCount: 0 })
    expect(HumanConstructor).not.toHaveBeenCalled()
  })

  it('loads Human.js and reports a detected face once active', async () => {
    detect.mockResolvedValue({ face: [{ id: 0 }] })
    const videoRef = { current: fakeVideo() }
    const canvasRef = { current: fakeCanvas() }
    const { result } = renderHook(() => useFaceAnalysis(videoRef, canvasRef, true, false))

    await wait(50)
    expect(HumanConstructor).toHaveBeenCalledTimes(1)
    expect(load).toHaveBeenCalledTimes(1)

    await wait(300)

    expect(result.current.faceDetected).toBe(true)
    expect(result.current.faceCount).toBe(1)
    expect(drawFace).toHaveBeenCalled()
  })

  it('reports no-face state when nothing is detected', async () => {
    detect.mockResolvedValue({ face: [] })
    const videoRef = { current: fakeVideo() }
    const canvasRef = { current: fakeCanvas() }
    const { result } = renderHook(() => useFaceAnalysis(videoRef, canvasRef, true, false))

    await wait(50)
    expect(load).toHaveBeenCalledTimes(1)
    await wait(300)

    expect(result.current.faceDetected).toBe(false)
    expect(result.current.faceCount).toBe(0)
    expect(detect).toHaveBeenCalled()
  })

  it('does not reload Human.js when the landmarks toggle changes', async () => {
    const videoRef = { current: fakeVideo() }
    const canvasRef = { current: fakeCanvas() }
    const { rerender } = renderHook(
      ({ showLandmarks }) => useFaceAnalysis(videoRef, canvasRef, true, showLandmarks),
      { initialProps: { showLandmarks: false } }
    )
    await wait(50)
    expect(HumanConstructor).toHaveBeenCalledTimes(1)

    rerender({ showLandmarks: true })
    rerender({ showLandmarks: false })
    await wait(10)

    expect(HumanConstructor).toHaveBeenCalledTimes(1)
  })

  it('stops detecting and resets state when the camera is stopped', async () => {
    const videoRef = { current: fakeVideo() }
    const canvasRef = { current: fakeCanvas() }
    detect.mockResolvedValue({ face: [{ id: 0 }] })
    const { result, rerender } = renderHook(
      ({ active }) => useFaceAnalysis(videoRef, canvasRef, active, false),
      { initialProps: { active: true } }
    )

    await wait(50)
    await wait(300)
    expect(result.current.faceDetected).toBe(true)

    const detectCallsWhileActive = detect.mock.calls.length

    // Camera stops (isActive -> false), matching CameraPanel's "Stop Camera" flow.
    rerender({ active: false })

    expect(result.current).toEqual({ loading: false, error: null, faceDetected: false, faceCount: 0 })

    await wait(300)
    expect(detect.mock.calls.length).toBe(detectCallsWhileActive) // no further detection ticks
  })
})

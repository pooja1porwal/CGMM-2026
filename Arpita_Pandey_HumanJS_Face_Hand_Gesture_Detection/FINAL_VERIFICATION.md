# Final Verification

Verified on 2026-09-01 locally, in Docker, in GitHub Actions, and on Render production. Updated
2026-09-07 with a live-recognition gating/smoothing/handedness fix pass (see below).

## Status

REST health/model/label routes, history CRUD, deterministic two-hand features, confidence
filtering, release-aware smoothing, browser camera controls, sentence editing, browser speech, and
the production frontend build are implemented. Missing models are reported without random output.

### 2026-09-07 live-recognition fix pass

Live webcam recognition was inconsistent because the 0.75 single-level confidence gate suppressed
correct-but-lower-confidence predictions (e.g. a verified letter "I" sample at 0.4496 confidence)
and one noisy frame reset the entire stability window. Fixed without retraining or replacing the
model artifact:

- Two-level gating: the raw/display prediction is always shown when a hand is detected; a separate,
  lower `COMMIT_CONFIDENCE_THRESHOLD` (0.50, picked from a validation confidence sweep, see
  `reports/confidence_threshold_analysis.json`) gates the temporal-stability window that commits.
- Temporal smoothing tolerates brief noisy/low-confidence frames and requires several consecutive
  no-hand/low-confidence frames before treating a held gesture as released, so a genuine repeat
  (e.g. the double "L" in "HELLO") can still commit while a held gesture does not repeat itself.
- Handedness/mirroring robustness: `InferenceService` now evaluates both the as-detected and
  swapped Left/Right hand-slot placements and keeps whichever the classifier is more confident
  about, making single/two-hand inference robust to webcam mirroring conventions that vary by
  browser/OS. See `MODEL_CARD.md` for the empirical verification of MediaPipe's handedness/mirroring
  sensitivity.
- React hooks (`usePrediction`, `useCamera`, `App`) were stabilized with `useCallback` so the
  camera frame interval and WebSocket connection are not torn down/recreated on every prediction,
  and the health check now runs once on mount instead of on every render.
- A developer/debug mode (opt-in per frame) surfaces handedness and top-3 class probabilities for
  live diagnosis without persisting any frames; `ml/webcam_diagnostic.py` runs the exact production
  pipeline against a local webcam for manual A-Z testing.

This is an application for **isolated static ISL A–Z fingerspelling recognition**, not an
unrestricted continuous ISL translator. A genuine RealSign artifact is included and loaded once at
startup. Frames are size-bounded and validated; missing models fail closed without random output.

## Results

- Dataset: RealSign Indian Sign Language Dataset, CC0-1.0
- Processed splits: 16,138 train / 2,179 validation / 4,052 held-out test
- Cleaning: 891 global exact duplicates removed; 2,716 no-hand images rejected
- Supported signs: static A–Z
- Model: StandardScaler + RBF SVC, scikit-learn 1.6.1
- Held-out accuracy / macro F1 / weighted F1: 0.9055 / 0.8968 / 0.9037
- Commit confidence threshold: 0.50 (raw/display prediction shown regardless of confidence)
- Backend Ruff: PASS
- Backend Black: PASS
- Backend pytest: PASS — 36 passed, 0 failed
- Frontend ESLint and TypeScript: PASS
- Frontend Vitest: PASS — 25 passed, 0 failed
- Frontend production build: PASS
- Docker build/start: PASS
- Container frontend, health, labels, and model endpoints: PASS
- Container health smoke: PASS
- WebSocket validation/error path: PASS
- Playwright E2E: PASS — 2 passed, 0 failed
- GitHub repository: PASS — https://github.com/arpita1505/SignSpeak-AI
- GitHub Actions: PASS on `main`
- Render HTTPS root and frontend asset: PASS
- Render `/api/health`: PASS — `model_loaded=true`, version `1.0.0-realsign`
- Render `/api/model/info`: PASS — real SVC metrics and A–Z model
- Render WebSocket: PASS — `wss://signspeak-ai-3l17.onrender.com/ws/predict`
- Live URL: https://signspeak-ai-3l17.onrender.com

## Remaining user actions

Perform an external signer-disjoint evaluation and an end-user camera usability study. The publisher
does not expose per-image signer IDs: global exact deduplication was completed, but near-duplicate
or signer overlap may remain and the held-out metrics can overstate new-user generalization. The
Render free instance has cold starts and ephemeral SQLite history; neither affects model integrity.

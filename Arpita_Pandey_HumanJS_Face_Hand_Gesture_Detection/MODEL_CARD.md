# Model Card — SignSpeak AI 1.0.0-realsign

Trained and evaluated on 2026-09-01. The deployable artifact is
`artifacts/signspeak_model.joblib`; machine-readable provenance is
`artifacts/model_metadata.json`.

## Model

- Task: isolated, static A–Z Indian Sign Language fingerspelling classification
- Selected classifier: RBF SVC (`C=10`, balanced class weights, probability output)
- Pipeline: `StandardScaler` → `SVC`
- Runtime: scikit-learn 1.6.1, random seed 42
- Input: 126 normalized MediaPipe hand-landmark features
- Output: one A–Z class plus an uncalibrated probability-like confidence
- Commit confidence threshold: 0.50 (see "Confidence threshold and live gating" below); the
  raw/display prediction is shown to the user regardless of confidence whenever a hand is detected

Random Forest (300 trees) and SVC candidates were trained only on the 16,138-sample training split.
Selection used validation macro F1; the 4,052-sample test split was evaluated once after selection.

| Candidate | Validation accuracy | Validation macro F1 | Training time |
|---|---:|---:|---:|
| Random Forest | 0.8738 | 0.8598 | 3.160 s |
| **SVC (selected)** | **0.8802** | **0.8688** | **2.635 s** |

## Held-out test results

| Metric | Score |
|---|---:|
| Accuracy | 0.9055 |
| Macro precision | 0.9228 |
| Macro recall | 0.9052 |
| Macro F1 | 0.8968 |
| Weighted F1 | 0.9037 |

The full per-class report and confusion matrix are in `reports/metrics/` and
`reports/figures/confusion_matrix.png`.

## Confidence threshold and live gating

The application uses a two-level gate, tuned from a validation-set confidence sweep (see
`reports/confidence_threshold_analysis.json`):

- **Raw/display prediction**: the classifier's top sign and confidence are shown to the user
  whenever MediaPipe detects a hand, at any confidence. This lets the user see what the model is
  reading even before it is stable enough to commit (e.g. "Detected: I, Confidence: 45%").
- **Commit threshold (`COMMIT_CONFIDENCE_THRESHOLD`, default 0.50)**: only frames at or above this
  confidence count toward the temporal-stability window that actually commits a letter.

0.75 (the value recorded in `artifacts/model_metadata.json` from the original training run) was too
aggressive for live use: it discarded ~12% of validation frames, including many *correct*
predictions in the 0.40-0.55 band (the documented letter "I" sample at 0.4496 confidence is one).
0.50 keeps 94.0% of validation frames while raising kept-frame accuracy from 88.1% (no gate) to
92.2%, and stays within the 0.50-0.55 range expected to work well for this classifier. This is an
inference-layer operating choice, not a change to the trained model, and can be tuned via the
`COMMIT_CONFIDENCE_THRESHOLD` environment variable without retraining.

Temporal smoothing (a majority vote over a rolling window, default 7 frames / 5-of-7 to commit)
tolerates brief noisy or low-confidence frames without discarding an otherwise-stable hold, and
requires several consecutive no-hand/low-confidence frames (default 3) before considering a held
gesture released -- this is what allows the same letter to be signed twice in a row (e.g. the
double "L" in "HELLO") once genuinely released, while still preventing one held gesture from
repeating ("AAAAA") for as long as it is held.

## Handedness / mirroring robustness

MediaPipe's Left/Right handedness label is derived purely from image pixel orientation and is known
to flip under horizontal mirroring (verified directly: flipping a correctly-labeled RealSign
training image with OpenCV inverts MediaPipe's reported handedness). Browsers/OSes vary in whether
a webcam's raw frame is already mirrored, which the server cannot detect or control, and the
project's own model card already flagged "mirrored-camera behavior" as a risk. Rather than guessing
a single convention or blindly flipping incoming frames, `InferenceService.process_frame` evaluates
the model on both the as-detected hand-slot placement and the swapped placement
(`MediaPipeService.swap_hand_slots`) and keeps whichever the trained classifier is more confident
about. This makes single/two-hand inference robust to the browser's mirroring convention without
retraining or changing the offline feature representation used for training
(`extract_realsign.py` and the live path both still call the same, unmodified
`MediaPipeService.detect_landmarks` / `pad_landmarks_for_two_hands`).

## Intended use

This model supports educational/demo use for isolated static A–Z signs with a clearly visible hand
and similar camera conditions. It is not a continuous language translator, accessibility guarantee,
or substitute for a qualified interpreter. It must not be used for medical, legal, safety-critical,
identity, surveillance, or consequential decisions.

## Limitations and risks

- Signer IDs were unavailable. Exact duplicates were removed globally, but near-duplicate and signer
  leakage may remain, so results can overestimate new-user performance.
- No independent external-user, demographic-fairness, device, or low-light evaluation was run.
- MediaPipe detection failures are outside classifier metrics and can reduce end-to-end coverage.
- Static hand landmarks omit motion, face, body pose, spatial grammar, and linguistic context.
- Similar hand shapes, occlusion, unusual viewpoints, accessories, and mirrored-camera behavior may
  cause confident errors.
- SVC probability estimates are not formally calibrated.

Before a public accessibility deployment, perform signer-disjoint external evaluation with target
users, consent and privacy review, confidence calibration, error analysis, and usability testing.

#!/usr/bin/env python3
"""Live webcam diagnostic tool for SignSpeak AI.

Runs the exact production inference pipeline (MediaPipeService -> ModelService ->
TemporalSmoothingService, including the handedness dual-variant disambiguation) against a local
webcam feed and overlays live diagnostics: raw predicted sign, confidence, stable sign, commit
decision, handedness actually used, hands detected, and the top-3 class probabilities.

No frames are saved or persisted anywhere -- only the expected/predicted/confidence/committed
summary (small text) is optionally logged, for a quick per-letter accuracy check while testing
A-Z manually.

Usage:
    cd backend && source venv/bin/activate && cd .. && python ml/webcam_diagnostic.py

Controls:
    A-Z     Set the "expected" sign for the letter you are about to test (logs a row once a
            commit happens for that expected letter).
    SPACE   Clear the current expected letter without logging anything.
    ESC     Quit and print a summary table (expected vs predicted, committed or not).
"""
from __future__ import annotations

import json
import time
from pathlib import Path

import cv2

from app.services.inference_service import InferenceService


def main(camera_index: int = 0) -> None:
    service = InferenceService()
    cap = cv2.VideoCapture(camera_index)
    if not cap.isOpened():
        print(f"Could not open camera index {camera_index}")
        return

    expected: str | None = None
    log: list[dict] = []
    print(__doc__)

    while True:
        ok, frame = cap.read()
        if not ok:
            break

        prediction_dict, _stable_sign, confidence = service.process_frame(frame)

        overlay = frame.copy()
        y = 30
        lines = [
            f"Expected: {expected or '-'}",
            f"Raw predicted: {prediction_dict['sign'] or '-'}  conf={confidence:.3f}",
            f"Stable: {prediction_dict['stable']}  Commit: {prediction_dict['commit']}",
            f"Hands: {prediction_dict['hands_detected']}  Handedness: {prediction_dict['handedness']}",
        ]
        for entry in prediction_dict.get("top_k") or []:
            lines.append(f"  top-k: {entry['sign']} = {entry['confidence']:.3f}")

        for line in lines:
            cv2.putText(
                overlay, line, (10, y), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2
            )
            y += 25

        if prediction_dict["commit"] and expected is not None:
            log.append(
                {
                    "expected": expected,
                    "predicted": prediction_dict["sign"],
                    "confidence": round(confidence, 4),
                    "committed": True,
                    "correct": prediction_dict["sign"] == expected,
                }
            )
            print(
                f"Logged: expected={expected} predicted={prediction_dict['sign']}"
                f" confidence={confidence:.3f} correct={prediction_dict['sign'] == expected}"
            )

        cv2.imshow("SignSpeak AI - Live Diagnostic (ESC to quit)", overlay)

        key = cv2.waitKey(1) & 0xFF
        if key == 27:  # ESC
            break
        elif key == 32:  # SPACE
            expected = None
        elif 65 <= key <= 90 or 97 <= key <= 122:  # A-Z or a-z
            expected = chr(key).upper()
            service.smoothing.reset()

    cap.release()
    cv2.destroyAllWindows()

    if log:
        total = len(log)
        correct = sum(1 for row in log if row["correct"])
        print(
            f"\n{correct}/{total} committed letters matched the expected letter"
            f" ({correct / total * 100:.1f}%)."
        )
        mismatches = [row for row in log if not row["correct"]]
        if mismatches:
            print("Mismatches (expected -> predicted):")
            for row in mismatches:
                print(
                    f"  {row['expected']} -> {row['predicted']} (conf={row['confidence']})"
                )

        out_path = Path("reports") / f"webcam_diagnostic_{int(time.time())}.json"
        out_path.parent.mkdir(exist_ok=True)
        out_path.write_text(json.dumps(log, indent=2))
        print(f"\nSummary written to {out_path} (no images/frames are saved).")
    else:
        print("\nNo letters were logged (press A-Z before holding a sign to log it).")


if __name__ == "__main__":
    main()

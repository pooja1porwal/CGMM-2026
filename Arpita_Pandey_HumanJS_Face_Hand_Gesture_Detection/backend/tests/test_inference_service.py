"""Tests for inference orchestration, including handedness-swap robustness."""

import numpy as np
import pytest

from app.services.inference_service import InferenceService
from app.services.smoothing_service import TemporalSmoothingService


class _StubMediaPipe:
    """Always reports one hand labeled 'Left', placed in the Left feature slot."""

    def detect_landmarks(self, frame):
        return [np.ones(63)], ["Left"], None

    def pad_landmarks_for_two_hands(self, landmarks_list, handedness_list):
        vec = np.zeros(126)
        vec[:63] = 1.0
        return vec

    def swap_hand_slots(self, feature_vector):
        return np.concatenate([feature_vector[63:], feature_vector[:63]])


class _StubModel:
    """Only confident when the payload lands in the Right (second) 63-value slot."""

    def is_model_loaded(self):
        return True

    def predict_topk(self, features, k=1):
        if np.allclose(features[63:], 1.0):
            return [("A", 0.95), ("B", 0.03), ("C", 0.02)][:k]
        return [("Z", 0.30), ("Y", 0.10), ("X", 0.05)][:k]


@pytest.fixture
def inference_service():
    service = InferenceService.__new__(InferenceService)
    service.mp_service = _StubMediaPipe()
    service.model_service = _StubModel()
    service.smoothing = TemporalSmoothingService(
        stability_window=7,
        stability_min_count=5,
        cooldown_ms=800,
        commit_confidence_threshold=0.5,
        release_frame_count=3,
    )
    return service


def test_process_frame_picks_higher_confidence_hand_slot(inference_service):
    """When the as-detected slot is wrong for this classifier, the swapped one should win."""
    frame = np.zeros((10, 10, 3), dtype=np.uint8)
    prediction_dict, _, confidence = inference_service.process_frame(frame)

    assert prediction_dict["sign"] == "A"
    assert confidence == pytest.approx(0.95)
    # Detected as "Left" but the winning placement was the swapped one, so the reported
    # handedness for diagnostics is flipped to reflect what was actually used.
    assert prediction_dict["handedness"] == ["Right"]
    assert [entry["sign"] for entry in prediction_dict["top_k"]] == ["A", "B", "C"]


def test_process_frame_no_hand_short_circuits(inference_service):
    class _NoHandMediaPipe(_StubMediaPipe):
        def detect_landmarks(self, frame):
            return None, None, None

    inference_service.mp_service = _NoHandMediaPipe()
    frame = np.zeros((10, 10, 3), dtype=np.uint8)
    prediction_dict, stable_sign, confidence = inference_service.process_frame(frame)

    assert prediction_dict["hands_detected"] == 0
    assert prediction_dict["sign"] is None
    assert stable_sign is None
    assert confidence == 0.0

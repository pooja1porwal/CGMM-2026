"""Temporal smoothing for stable predictions."""

from __future__ import annotations

import logging
from collections import Counter, deque
from time import time

from app.config import settings

logger = logging.getLogger(__name__)


class TemporalSmoothingService:
    """Service for temporal smoothing of predictions.

    Only frames at or above ``commit_confidence_threshold`` are counted toward the majority-vote
    stability window. A frame below that threshold (or with no hand) does not immediately wipe
    accumulated progress -- it only does so once ``release_frame_count`` such frames occur in a
    row, which tolerates the occasional noisy webcam frame while still detecting a genuine
    gesture release (hand dropped, or changed to a different shape) so the same letter can be
    committed again later (e.g. the double "L" in "HELLO").
    """

    def __init__(
        self,
        stability_window: int = settings.stability_window,
        stability_min_count: int = settings.stability_min_count,
        cooldown_ms: int = settings.sign_cooldown_ms,
        commit_confidence_threshold: float = settings.commit_confidence_threshold,
        release_frame_count: int = settings.release_frame_count,
    ):
        """
        Initialize temporal smoothing.

        Args:
            stability_window: Number of recent *valid* frames to consider for majority vote.
            stability_min_count: Minimum frames with same sign for stability.
            cooldown_ms: Cooldown in milliseconds after emitting a sign.
            commit_confidence_threshold: Minimum confidence for a frame to count toward stability.
            release_frame_count: Consecutive weak/no-hand frames required to consider the
                gesture released, allowing the same sign to be committed again.
        """
        self.stability_window = stability_window
        self.stability_min_count = stability_min_count
        self.cooldown_ms = cooldown_ms
        self.commit_confidence_threshold = commit_confidence_threshold
        self.release_frame_count = release_frame_count

        # State tracking
        self.prediction_history: deque = deque(maxlen=stability_window)
        self.last_emitted_sign: str | None = None
        self.last_emit_time: float = 0.0
        self.released_since_emit = True
        self.consecutive_weak_frames = 0

    def process_prediction(self, sign: str | None, confidence: float) -> tuple[str | None, bool]:
        """
        Process a prediction with temporal smoothing.

        Args:
            sign: Predicted sign
            confidence: Confidence score

        Returns:
            Tuple of (stable_sign, should_commit)
            stable_sign: The sign if stable, None otherwise
            should_commit: Whether this should be added to translation
        """
        current_time = time() * 1000  # Convert to milliseconds

        is_valid = sign is not None and confidence >= self.commit_confidence_threshold

        if not is_valid:
            self.consecutive_weak_frames += 1
            if self.consecutive_weak_frames >= self.release_frame_count:
                self.prediction_history.clear()
                self.released_since_emit = True
            return None, False

        self.consecutive_weak_frames = 0
        self.prediction_history.append(sign)

        # Check if we have enough valid predictions in the window
        if len(self.prediction_history) < self.stability_min_count:
            return None, False

        # Majority vote across the window
        sign_counts = Counter(self.prediction_history)
        most_common_sign, most_common_count = sign_counts.most_common(1)[0]

        # Check if it's stable
        if most_common_count < self.stability_min_count:
            return None, False

        # A stable sign different from the last emitted one implies the previous gesture
        # was released (the hand visibly changed shape), independent of the no-hand/weak path.
        if most_common_sign != self.last_emitted_sign:
            self.released_since_emit = True

        # Check cooldown
        time_since_last = current_time - self.last_emit_time
        if time_since_last < self.cooldown_ms:
            return most_common_sign, False

        # Check if it's different from last emitted (or genuinely released since then)
        if most_common_sign != self.last_emitted_sign or self.released_since_emit:
            self.last_emitted_sign = most_common_sign
            self.last_emit_time = current_time
            self.released_since_emit = False
            return most_common_sign, True

        return most_common_sign, False

    def reset(self):
        """Reset the temporal state."""
        self.prediction_history.clear()
        self.last_emitted_sign = None
        self.last_emit_time = 0.0
        self.released_since_emit = True
        self.consecutive_weak_frames = 0

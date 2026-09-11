"""Tests for temporal smoothing service."""

import pytest

from app.services.smoothing_service import TemporalSmoothingService


@pytest.fixture
def smoothing_service():
    """Create smoothing service instance (window=7, min_count=5, matching production defaults)."""
    return TemporalSmoothingService(
        stability_window=7,
        stability_min_count=5,
        cooldown_ms=800,
        commit_confidence_threshold=0.5,
        release_frame_count=3,
    )


def test_process_prediction_low_confidence(smoothing_service):
    """Frames below the commit threshold never contribute to stability."""
    sign, should_commit = smoothing_service.process_prediction("A", 0.3)
    assert sign is None
    assert should_commit is False


def test_process_prediction_at_threshold_counts_as_valid(smoothing_service):
    """A frame exactly at the commit threshold is accepted (inclusive boundary)."""
    for _ in range(5):
        sign, _ = smoothing_service.process_prediction("A", 0.5)
    assert sign == "A"


def test_process_prediction_not_enough_frames(smoothing_service):
    """Test that we need enough frames for stability."""
    for _ in range(4):
        sign, should_commit = smoothing_service.process_prediction("A", 0.9)
        assert sign is None
        assert should_commit is False


def test_process_prediction_stable_sign(smoothing_service):
    """Test stable sign detection and that it commits once."""
    should_commit = False
    for _ in range(5):
        sign, should_commit = smoothing_service.process_prediction("A", 0.9)

    assert sign == "A"
    assert should_commit is True


def test_process_prediction_sign_change(smoothing_service):
    """A brand new sign needs its own run of frames before it stabilizes."""
    for _ in range(5):
        smoothing_service.process_prediction("A", 0.9)

    sign, _should_commit = smoothing_service.process_prediction("B", 0.9)

    # Window still has 4 A's and 1 B: A remains the majority.
    assert sign == "A"


def test_process_prediction_cooldown(smoothing_service):
    """Test that cooldown prevents duplicate emissions while holding the same sign."""
    for _ in range(5):
        smoothing_service.process_prediction("A", 0.9)

    # Continue holding the same sign - should not re-emit (this also prevents "AAAAA").
    for _ in range(10):
        _sign, should_commit = smoothing_service.process_prediction("A", 0.9)
        assert should_commit is False


def test_holding_one_sign_never_repeats_without_release():
    """Prevent repeated AAAAA while holding A: only the first stabilization commits."""
    service = TemporalSmoothingService(
        stability_window=7,
        stability_min_count=5,
        cooldown_ms=0,  # isolate from cooldown timing for this test
        commit_confidence_threshold=0.5,
        release_frame_count=3,
    )

    commits = []
    for _ in range(30):
        _sign, should_commit = service.process_prediction("A", 0.9)
        commits.append(should_commit)

    assert commits.count(True) == 1


def test_tolerates_single_noisy_low_confidence_frame(smoothing_service):
    """One noisy low-confidence frame must not wipe accumulated stability progress."""
    for _ in range(3):
        sign, _ = smoothing_service.process_prediction("A", 0.9)
    assert sign is None

    # A single noisy/low-confidence frame in the middle of an otherwise steady hold.
    sign, should_commit = smoothing_service.process_prediction("A", 0.2)
    assert sign is None
    assert should_commit is False

    # Progress should have been preserved: two more valid frames complete the window.
    for _ in range(2):
        sign, should_commit = smoothing_service.process_prediction("A", 0.9)

    assert sign == "A"
    assert should_commit is True


def test_tolerates_two_consecutive_noisy_frames(smoothing_service):
    """Up to release_frame_count - 1 consecutive weak frames are tolerated."""
    for _ in range(3):
        smoothing_service.process_prediction("A", 0.9)

    for _ in range(2):  # two weak frames in a row (below release_frame_count=3)
        sign, should_commit = smoothing_service.process_prediction(None, 0.0)
        assert sign is None
        assert should_commit is False

    for _ in range(2):
        sign, should_commit = smoothing_service.process_prediction("A", 0.9)

    assert sign == "A"
    assert should_commit is True


def test_no_hand_release_clears_history_after_threshold(smoothing_service):
    """Three consecutive no-hand frames clear history and mark the gesture released."""
    for _ in range(5):
        smoothing_service.process_prediction("A", 0.9)

    for _ in range(3):
        sign, should_commit = smoothing_service.process_prediction(None, 0.0)
        assert sign is None
        assert should_commit is False

    # History was cleared: holding A again needs a fresh full run of frames.
    for _ in range(4):
        sign, _ = smoothing_service.process_prediction("A", 0.9)
        assert sign is None


def test_same_letter_recommits_after_genuine_release():
    """The double L in HELLO: same sign commits again after a real no-hand release."""
    service = TemporalSmoothingService(
        stability_window=7,
        stability_min_count=5,
        cooldown_ms=0,
        commit_confidence_threshold=0.5,
        release_frame_count=3,
    )

    commits = []
    for _ in range(5):
        _sign, should_commit = service.process_prediction("L", 0.9)
        commits.append(should_commit)
    assert commits.count(True) == 1

    # Hand genuinely drops for several frames.
    for _ in range(3):
        service.process_prediction(None, 0.0)

    commits = []
    for _ in range(5):
        _sign, should_commit = service.process_prediction("L", 0.9)
        commits.append(should_commit)

    assert commits.count(True) == 1


def test_same_letter_recommits_after_sign_change():
    """A different intervening sign also counts as a release for a later repeat."""
    service = TemporalSmoothingService(
        stability_window=7,
        stability_min_count=5,
        cooldown_ms=0,
        commit_confidence_threshold=0.5,
        release_frame_count=3,
    )

    for _ in range(5):
        service.process_prediction("L", 0.9)

    for _ in range(5):
        service.process_prediction("O", 0.9)

    commits = []
    for _ in range(5):
        _sign, should_commit = service.process_prediction("L", 0.9)
        commits.append(should_commit)

    assert commits.count(True) == 1


def test_reset(smoothing_service):
    """Test reset functionality."""
    for _ in range(5):
        smoothing_service.process_prediction("A", 0.9)

    smoothing_service.reset()

    sign, _should_commit = smoothing_service.process_prediction("B", 0.9)
    assert sign is None  # Reset cleared history

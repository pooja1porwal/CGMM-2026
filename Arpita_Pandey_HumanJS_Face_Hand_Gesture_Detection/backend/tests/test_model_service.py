"""Tests for model service prediction logic."""

import numpy as np
import pytest

from app.services.model_service import ModelService


class _FakeSklearnModel:
    """Minimal stand-in for the trained sklearn pipeline."""

    classes_ = np.array(["A", "B", "C"])

    def predict_proba(self, features_reshaped):
        return np.array([[0.7, 0.2, 0.1]])


@pytest.fixture
def model_service(monkeypatch):
    """A ModelService wired to a fake model, without touching disk."""
    monkeypatch.setattr(ModelService, "load_model", lambda self: True)
    service = ModelService()
    service.model = _FakeSklearnModel()
    service.metadata = {"feature_dimension": 4}
    service.labels = ["A", "B", "C"]
    return service


def test_predict_returns_top1(model_service):
    sign, confidence = model_service.predict(np.zeros(4))
    assert sign == "A"
    assert confidence == pytest.approx(0.7)


def test_predict_topk_orders_by_confidence_descending(model_service):
    topk = model_service.predict_topk(np.zeros(4), k=3)
    assert [label for label, _ in topk] == ["A", "B", "C"]
    assert topk[0][1] == pytest.approx(0.7)
    assert topk[1][1] == pytest.approx(0.2)
    assert topk[2][1] == pytest.approx(0.1)


def test_predict_topk_rejects_wrong_feature_dimension(model_service):
    assert model_service.predict_topk(np.zeros(3), k=3) == []


def test_predict_when_model_not_loaded(monkeypatch):
    monkeypatch.setattr(ModelService, "load_model", lambda self: False)
    service = ModelService()
    assert service.predict(np.zeros(4)) == (None, 0.0)
    assert service.predict_topk(np.zeros(4), k=3) == []

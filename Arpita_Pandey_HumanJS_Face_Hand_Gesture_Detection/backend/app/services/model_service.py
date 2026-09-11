"""Model loading and inference service."""

from __future__ import annotations

import json
import logging
from pathlib import Path

import numpy as np
from joblib import load

from app.config import settings

logger = logging.getLogger(__name__)


class ModelService:
    """Service for loading and running ML model inference."""

    def __init__(self):
        """Initialize model service."""
        self.model = None
        self.metadata = None
        self.labels = None
        self.load_model()

    def load_model(self) -> bool:
        """
        Load the ML model from disk.

        Returns:
            True if successful, False otherwise
        """
        try:
            model_path = Path(settings.model_path)
            metadata_path = Path(settings.model_metadata_path)

            if not model_path.exists():
                logger.warning(f"Model file not found: {model_path}")
                return False

            # Load model
            self.model = load(model_path)
            logger.info(f"Model loaded from {model_path}")

            # Load metadata
            if metadata_path.exists():
                with open(metadata_path, "r") as f:
                    self.metadata = json.load(f)
                self.labels = self.metadata.get("supported_labels", [])
                logger.info(f"Model metadata loaded: version {self.metadata.get('version')}")
            else:
                logger.warning(f"Metadata file not found: {metadata_path}")
                self.labels = []

            return True
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            return False

    def predict_topk(self, features: np.ndarray, k: int = 1) -> list[tuple[str, float]]:
        """
        Predict and return the top-k (label, confidence) pairs, most confident first.

        Args:
            features: Feature vector from normalized landmarks
            k: Number of top predictions to return

        Returns:
            List of (label, confidence) tuples, empty if prediction is not possible.
        """
        if self.model is None:
            logger.warning("Model not loaded")
            return []

        try:
            # Validate feature dimension
            expected = int((self.metadata or {}).get("feature_dimension", 126))
            if len(features) != expected:
                logger.warning(f"Invalid feature dimension: {len(features)}, expected {expected}")
                return []

            # Reshape for sklearn model
            features_reshaped = features.reshape(1, -1)

            proba = self.model.predict_proba(features_reshaped)[0]
            classes = self.model.classes_
            order = np.argsort(proba)[::-1][:k]

            return [(str(classes[i]), float(proba[i])) for i in order]

        except Exception as e:
            logger.error(f"Error during prediction: {e}")
            return []

    def predict(self, features: np.ndarray) -> tuple[str | None, float]:
        """
        Make a prediction.

        Args:
            features: Feature vector from normalized landmarks

        Returns:
            Tuple of (predicted_label, confidence)
        """
        top1 = self.predict_topk(features, k=1)
        if not top1:
            return None, 0.0
        return top1[0]

    def is_model_loaded(self) -> bool:
        """Check if model is loaded."""
        return self.model is not None

    def get_model_version(self) -> str | None:
        """Get model version."""
        if self.metadata:
            return self.metadata.get("version")
        return None

    def get_supported_labels(self) -> list[str]:
        """Get list of supported labels."""
        return self.labels if self.labels else []

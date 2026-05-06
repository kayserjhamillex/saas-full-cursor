import math

from app.services.inference.model_loader_service import get_cnn_model_artifact
from shared.feature_extraction import extract_feature_vector


def run_cnn_prediction(image_bytes: bytes, model_artifact: dict | None = None) -> dict[str, float | str]:
    artifact = model_artifact or get_cnn_model_artifact()
    threshold = float(artifact["threshold"])
    weights = list(artifact["weights"])
    bias = float(artifact["bias"])
    feature_vector = extract_feature_vector(image_bytes)
    if len(feature_vector) != len(weights):
        weights = [1.0, 0.0, 0.0]
        bias = 0.0

    linear_value = sum(value * weight for value, weight in zip(feature_vector, weights)) + bias
    score = 1 / (1 + math.exp(-linear_value))
    finding = "lesion_probable" if score >= threshold else "sin_hallazgo_relevante"
    return {"finding": finding, "confidence": round(score, 2)}

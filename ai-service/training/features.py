import math

from shared.feature_extraction import decode_base64_bytes, extract_feature_vector


def compute_feature_vector_from_base64(image_base64: str) -> list[float]:
    image_bytes = decode_base64_bytes(image_base64)
    return extract_feature_vector(image_bytes)


def run_linear_inference(feature_vector: list[float], weights: list[float], bias: float) -> float:
    if len(feature_vector) != len(weights):
        raise ValueError("Vector de features y pesos deben tener la misma longitud")

    linear_value = sum(value * weight for value, weight in zip(feature_vector, weights)) + bias
    # Logistic output to keep score normalized in [0, 1].
    score = 1 / (1 + math.exp(-linear_value))
    return round(score, 6)

from training.features import compute_feature_vector_from_base64, run_linear_inference
from training.metrics import build_metrics
from training.schemas import EvaluationMetrics, ModelArtifact, TrainingSample


def train_threshold_model(samples: list[TrainingSample], model_version: str) -> tuple[ModelArtifact, EvaluationMetrics]:
    if not samples:
        raise ValueError("Se requieren muestras para entrenar")

    feature_vectors = [compute_feature_vector_from_base64(sample.image_base64) for sample in samples]
    labels = [sample.label for sample in samples]
    feature_size = len(feature_vectors[0])
    if any(len(vector) != feature_size for vector in feature_vectors):
        raise ValueError("Todos los vectores de features deben tener la misma longitud")

    positive_vectors = [vector for vector, label in zip(feature_vectors, labels) if label == 1]
    negative_vectors = [vector for vector, label in zip(feature_vectors, labels) if label == 0]
    if not positive_vectors or not negative_vectors:
        raise ValueError("Se requieren muestras positivas y negativas para entrenar")

    mean_positive = _mean_vector(positive_vectors)
    mean_negative = _mean_vector(negative_vectors)
    weights = [round(pos - neg, 6) for pos, neg in zip(mean_positive, mean_negative)]
    midpoint = [(pos + neg) / 2 for pos, neg in zip(mean_positive, mean_negative)]
    bias = round(-sum(weight * point for weight, point in zip(weights, midpoint)), 6)
    scores = [run_linear_inference(vector, weights, bias) for vector in feature_vectors]

    best_threshold = 0.5
    best_metrics = EvaluationMetrics(accuracy=0.0, precision=0.0, recall=0.0)

    for step in range(10, 91, 5):
        threshold = step / 100
        predictions = [1 if score >= threshold else 0 for score in scores]
        metrics = build_metrics(labels, predictions)
        if metrics.accuracy > best_metrics.accuracy:
            best_threshold = threshold
            best_metrics = metrics

    artifact = ModelArtifact(
        version=model_version,
        feature_version="v1",
        weights=weights,
        bias=bias,
        threshold=best_threshold,
    )
    return artifact, best_metrics


def _mean_vector(vectors: list[list[float]]) -> list[float]:
    count = len(vectors)
    vector_size = len(vectors[0])
    sums = [0.0] * vector_size
    for vector in vectors:
        for index, value in enumerate(vector):
            sums[index] += value
    return [round(total / count, 6) for total in sums]

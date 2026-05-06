from dataclasses import dataclass


@dataclass(frozen=True)
class TrainingSample:
    image_base64: str
    label: int


@dataclass(frozen=True)
class ModelArtifact:
    version: str
    feature_version: str
    weights: list[float]
    bias: float
    threshold: float


@dataclass(frozen=True)
class EvaluationMetrics:
    accuracy: float
    precision: float
    recall: float

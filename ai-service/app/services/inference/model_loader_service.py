import json
import os
from pathlib import Path

from app.services.inference.model_registry_store import get_active_cnn_model_version

DEFAULT_ARTIFACT_TEMPLATE = {
    "weights": [1.0, 0.0, 0.0],
    "bias": 0.0,
    "threshold": 0.5,
    "featureVersion": "v1",
}
_artifact_cache_by_version: dict[str, dict[str, object]] = {}
_last_successful_artifact: dict[str, object] | None = None


def reset_model_artifact_cache() -> None:
    global _last_successful_artifact
    _artifact_cache_by_version.clear()
    _last_successful_artifact = None


def get_cnn_model_artifact() -> dict[str, object]:
    global _last_successful_artifact
    default_version = os.getenv("AI_CNN_MODEL_VERSION", "cnn-0.1.0")
    model_version = get_active_cnn_model_version(default_version)
    if model_version in _artifact_cache_by_version:
        return _artifact_cache_by_version[model_version]

    model_file = _resolve_model_file_path(model_version)
    if not model_file.exists():
        artifact = _build_default_artifact(model_version)
        _artifact_cache_by_version[model_version] = artifact
        return artifact

    try:
        with model_file.open("r", encoding="utf-8") as model_payload:
            payload = json.load(model_payload)
        artifact = _normalize_artifact_payload(payload, model_version)
        _artifact_cache_by_version[model_version] = artifact
        _last_successful_artifact = artifact
        return artifact
    except (OSError, ValueError, TypeError, json.JSONDecodeError):
        if _last_successful_artifact is not None:
            return _last_successful_artifact
        return _build_default_artifact(model_version)


def _resolve_model_file_path(model_version: str) -> Path:
    model_dir = os.getenv("AI_MODEL_OUTPUT_DIR", "models")
    return Path(model_dir) / f"cnn_{model_version}.json"


def _build_default_artifact(model_version: str) -> dict[str, object]:
    artifact = dict(DEFAULT_ARTIFACT_TEMPLATE)
    artifact["weights"] = list(DEFAULT_ARTIFACT_TEMPLATE["weights"])
    artifact["modelVersion"] = model_version
    return artifact


def _normalize_artifact_payload(payload: dict[str, object], model_version: str) -> dict[str, object]:
    threshold = float(payload.get("threshold", 0.5))
    if threshold < 0 or threshold > 1:
        threshold = 0.5

    weights = payload.get("weights", [1.0, 0.0, 0.0])
    if not isinstance(weights, list) or not weights:
        weights = [1.0, 0.0, 0.0]
    parsed_weights = [float(weight) for weight in weights]

    bias = float(payload.get("bias", 0.0))
    feature_version = str(payload.get("feature_version", payload.get("featureVersion", "v1")))
    return {
        "weights": parsed_weights,
        "bias": bias,
        "threshold": threshold,
        "featureVersion": feature_version,
        "modelVersion": model_version,
    }

import time
import json
import os
from pathlib import Path

from fastapi.responses import PlainTextResponse

from app.core.settings import get_settings
from app.services.inference.model_registry_store import get_active_cnn_model_version

metrics_state = {
    "prediction_requests_total": 0,
    "prediction_requests_error_total": 0,
    "prediction_requests_duration_ms_total": 0,
    "prediction_requests_duration_ms_values": [],
    "prediction_requests_by_model_version": {},
    "prediction_errors_by_type": {},
}


def reset_prediction_metrics() -> None:
    metrics_state["prediction_requests_total"] = 0
    metrics_state["prediction_requests_error_total"] = 0
    metrics_state["prediction_requests_duration_ms_total"] = 0
    metrics_state["prediction_requests_duration_ms_values"] = []
    metrics_state["prediction_requests_by_model_version"] = {}
    metrics_state["prediction_errors_by_type"] = {}


def register_prediction_metric(
    status_code: int,
    duration_ms: int,
    model_version: str | None = None,
    error_type: str | None = None,
) -> None:
    metrics_state["prediction_requests_total"] += 1
    metrics_state["prediction_requests_duration_ms_total"] += duration_ms
    metrics_state["prediction_requests_duration_ms_values"].append(duration_ms)
    if len(metrics_state["prediction_requests_duration_ms_values"]) > 500:
        metrics_state["prediction_requests_duration_ms_values"] = metrics_state[
            "prediction_requests_duration_ms_values"
        ][-500:]

    if model_version:
        current_count = int(metrics_state["prediction_requests_by_model_version"].get(model_version, 0))
        metrics_state["prediction_requests_by_model_version"][model_version] = current_count + 1

    if status_code >= 400:
        metrics_state["prediction_requests_error_total"] += 1
        normalized_error_type = error_type or f"http_{status_code}"
        error_count = int(metrics_state["prediction_errors_by_type"].get(normalized_error_type, 0))
        metrics_state["prediction_errors_by_type"][normalized_error_type] = error_count + 1


def _percentile(values: list[int], percentile: float) -> float:
    if not values:
        return 0.0
    sorted_values = sorted(values)
    index = int(round((len(sorted_values) - 1) * percentile))
    return float(sorted_values[index])


def _load_active_model_quality_metrics() -> tuple[str, float, float, float]:
    settings = get_settings()
    active_model_version = get_active_cnn_model_version(settings.cnn_model_version)
    output_dir = os.getenv("AI_MODEL_OUTPUT_DIR", "models")
    report_path = Path(output_dir) / f"cnn_{active_model_version}_metrics.json"

    if not report_path.exists():
        return active_model_version, 0.0, 0.0, 0.0

    try:
        with report_path.open("r", encoding="utf-8") as report_file:
            payload = json.load(report_file)
    except (json.JSONDecodeError, OSError):
        return active_model_version, 0.0, 0.0, 0.0

    metrics_payload = payload.get("metrics", {})
    accuracy = float(metrics_payload.get("accuracy", 0.0))
    precision = float(metrics_payload.get("precision", 0.0))
    recall = float(metrics_payload.get("recall", 0.0))
    return active_model_version, accuracy, precision, recall


def render_metrics_payload() -> PlainTextResponse:
    process_time = time.process_time()
    prediction_total = metrics_state["prediction_requests_total"]
    duration_total = metrics_state["prediction_requests_duration_ms_total"]
    prediction_avg_ms = (duration_total / prediction_total) if prediction_total else 0
    p50_ms = _percentile(metrics_state["prediction_requests_duration_ms_values"], 0.50)
    p95_ms = _percentile(metrics_state["prediction_requests_duration_ms_values"], 0.95)
    active_model_version, accuracy, precision, recall = _load_active_model_quality_metrics()
    model_version_lines = [
        f'ai_prediction_requests_by_model_version_total{{model_version="{model_version}"}} {count}'
        for model_version, count in sorted(metrics_state["prediction_requests_by_model_version"].items())
    ]
    error_type_lines = [
        f'ai_prediction_errors_by_type_total{{error_type="{error_type}"}} {count}'
        for error_type, count in sorted(metrics_state["prediction_errors_by_type"].items())
    ]
    payload = "\n".join(
        [
            f"python_process_time_seconds {process_time}",
            f"python_time_seconds {time.time()}",
            f"ai_prediction_requests_total {prediction_total}",
            f"ai_prediction_requests_error_total {metrics_state['prediction_requests_error_total']}",
            f"ai_prediction_requests_avg_duration_ms {round(prediction_avg_ms, 2)}",
            f"ai_prediction_requests_p50_duration_ms {round(p50_ms, 2)}",
            f"ai_prediction_requests_p95_duration_ms {round(p95_ms, 2)}",
            f'ai_model_accuracy{{model_version="{active_model_version}"}} {round(accuracy, 4)}',
            f'ai_model_precision{{model_version="{active_model_version}"}} {round(precision, 4)}',
            f'ai_model_recall{{model_version="{active_model_version}"}} {round(recall, 4)}',
            *model_version_lines,
            *error_type_lines,
        ]
    )
    return PlainTextResponse(payload, media_type="text/plain; version=0.0.4")

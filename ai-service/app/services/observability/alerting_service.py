def parse_prometheus_text_metrics(metrics_text: str) -> dict[str, float]:
    parsed_metrics: dict[str, float] = {}
    for raw_line in metrics_text.splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split()
        if len(parts) < 2:
            continue
        metric_name = parts[0]
        metric_value = parts[1]
        try:
            parsed_metrics[metric_name] = float(metric_value)
        except ValueError:
            continue
    return parsed_metrics


def evaluate_prediction_alerts(
    metrics_text: str,
    max_error_rate: float,
    max_p95_ms: float,
    min_requests_for_alert: int,
) -> list[str]:
    metrics = parse_prometheus_text_metrics(metrics_text)
    total_requests = int(metrics.get("ai_prediction_requests_total", 0))
    total_errors = int(metrics.get("ai_prediction_requests_error_total", 0))
    p95_duration = float(metrics.get("ai_prediction_requests_p95_duration_ms", 0.0))

    alerts: list[str] = []
    if total_requests < min_requests_for_alert:
        return alerts

    error_rate = (total_errors / total_requests) if total_requests else 0.0
    if error_rate > max_error_rate:
        alerts.append(
            "error_rate_exceeded:"
            f"{round(error_rate, 4)}>{max_error_rate} (errors={total_errors}, total={total_requests})"
        )

    if p95_duration > max_p95_ms:
        alerts.append(f"p95_latency_exceeded:{round(p95_duration, 2)}>{max_p95_ms}")

    return alerts

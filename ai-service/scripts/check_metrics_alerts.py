import argparse
import os
import sys
import urllib.request
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.observability.alerting_service import evaluate_prediction_alerts


def main() -> None:
    parser = argparse.ArgumentParser(description="Check AI prediction alerts from /metrics")
    parser.add_argument(
        "--metrics-url",
        default=os.getenv("AI_METRICS_URL", "http://localhost:8000/metrics"),
        help="Metrics endpoint URL",
    )
    parser.add_argument(
        "--max-error-rate",
        type=float,
        default=float(os.getenv("AI_ALERT_MAX_ERROR_RATE", "0.05")),
        help="Maximum acceptable error rate (0-1)",
    )
    parser.add_argument(
        "--max-p95-ms",
        type=float,
        default=float(os.getenv("AI_ALERT_MAX_P95_MS", "200")),
        help="Maximum acceptable p95 latency in ms",
    )
    parser.add_argument(
        "--min-requests",
        type=int,
        default=int(os.getenv("AI_ALERT_MIN_REQUESTS_FOR_ALERT", "20")),
        help="Minimum total requests before enforcing alerts",
    )
    args = parser.parse_args()

    with urllib.request.urlopen(args.metrics_url) as response:
        metrics_text = response.read().decode("utf-8")

    alerts = evaluate_prediction_alerts(
        metrics_text=metrics_text,
        max_error_rate=args.max_error_rate,
        max_p95_ms=args.max_p95_ms,
        min_requests_for_alert=args.min_requests,
    )

    if alerts:
        print({"status": "alert", "alerts": alerts, "metricsUrl": args.metrics_url})
        raise SystemExit(2)

    print({"status": "ok", "alerts": [], "metricsUrl": args.metrics_url})


if __name__ == "__main__":
    main()

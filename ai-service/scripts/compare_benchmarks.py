import argparse
import json
from pathlib import Path


def load_report(path: str) -> dict:
    report_path = Path(path)
    if not report_path.exists():
        raise ValueError(f"No existe archivo de benchmark: {path}")
    try:
        payload = json.loads(report_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValueError(f"Archivo benchmark invalido (JSON): {path}") from exc
    if "benchmarkReport" not in payload:
        raise ValueError(f"Archivo benchmark sin campo benchmarkReport: {path}")
    return payload["benchmarkReport"]


def main() -> None:
    parser = argparse.ArgumentParser(description="Compare benchmark reports (baseline vs candidate)")
    parser.add_argument("--baseline", required=True, help="Path to baseline benchmark JSON")
    parser.add_argument("--candidate", required=True, help="Path to candidate benchmark JSON")
    parser.add_argument(
        "--max-p95-regression-pct",
        type=float,
        default=10.0,
        help="Maximum allowed p95 latency increase percentage",
    )
    parser.add_argument(
        "--max-p99-regression-pct",
        type=float,
        default=10.0,
        help="Maximum allowed p99 latency increase percentage",
    )
    parser.add_argument(
        "--max-throughput-drop-pct",
        type=float,
        default=10.0,
        help="Maximum allowed throughput decrease percentage",
    )
    args = parser.parse_args()

    baseline = load_report(args.baseline)
    candidate = load_report(args.candidate)
    baseline_agg = baseline.get("aggregate", {})
    candidate_agg = candidate.get("aggregate", {})

    baseline_p95 = float(baseline_agg.get("avgP95LatencyMs", 0.0))
    candidate_p95 = float(candidate_agg.get("avgP95LatencyMs", 0.0))
    baseline_p99 = float(baseline_agg.get("avgP99LatencyMs", 0.0))
    candidate_p99 = float(candidate_agg.get("avgP99LatencyMs", 0.0))
    baseline_throughput = float(baseline_agg.get("avgThroughputRps", 0.0))
    candidate_throughput = float(candidate_agg.get("avgThroughputRps", 0.0))

    p95_regression_pct = (
        ((candidate_p95 - baseline_p95) / baseline_p95) * 100.0 if baseline_p95 > 0 else 0.0
    )
    p99_regression_pct = (
        ((candidate_p99 - baseline_p99) / baseline_p99) * 100.0 if baseline_p99 > 0 else 0.0
    )
    throughput_drop_pct = (
        ((baseline_throughput - candidate_throughput) / baseline_throughput) * 100.0
        if baseline_throughput > 0
        else 0.0
    )

    checks = {
        "p95RegressionPct": round(p95_regression_pct, 2),
        "p99RegressionPct": round(p99_regression_pct, 2),
        "throughputDropPct": round(throughput_drop_pct, 2),
    }
    alerts: list[str] = []
    if p95_regression_pct > args.max_p95_regression_pct:
        alerts.append(
            f"p95_regression_exceeded:{round(p95_regression_pct,2)}>{args.max_p95_regression_pct}"
        )
    if p99_regression_pct > args.max_p99_regression_pct:
        alerts.append(
            f"p99_regression_exceeded:{round(p99_regression_pct,2)}>{args.max_p99_regression_pct}"
        )
    if throughput_drop_pct > args.max_throughput_drop_pct:
        alerts.append(
            f"throughput_drop_exceeded:{round(throughput_drop_pct,2)}>{args.max_throughput_drop_pct}"
        )

    output_payload = {
        "baseline": args.baseline,
        "candidate": args.candidate,
        "checks": checks,
        "thresholds": {
            "maxP95RegressionPct": args.max_p95_regression_pct,
            "maxP99RegressionPct": args.max_p99_regression_pct,
            "maxThroughputDropPct": args.max_throughput_drop_pct,
        },
        "alerts": alerts,
    }
    if alerts:
        print({"status": "alert", **output_payload})
        raise SystemExit(2)

    print({"status": "ok", **output_payload})


if __name__ == "__main__":
    main()

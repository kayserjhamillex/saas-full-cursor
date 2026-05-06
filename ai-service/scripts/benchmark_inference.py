import argparse
import asyncio
import json
import os
import statistics
import sys
import time
from collections import Counter
from pathlib import Path

import httpx

sys.path.append(str(Path(__file__).resolve().parents[1]))

# Keep rate limiting out of the way for benchmark runs.
os.environ.setdefault("AI_RATE_LIMIT_REQUESTS", "100000")
os.environ.setdefault("AI_RATE_LIMIT_WINDOW_SECONDS", "60")

from app.main import app
from app.services.observability.performance_service import build_performance_summary

VALID_PNG_BASE64 = (
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8A"
    "An8B9p87sQAAAABJRU5ErkJggg=="
)


def build_payload(index: int, model_type: str) -> dict[str, str]:
    return {
        "tenantId": "tenant-benchmark",
        "patientId": f"patient-{index}",
        "encounterId": f"encounter-{index}",
        "imageName": "image.png",
        "mimeType": "image/png",
        "imageBase64": VALID_PNG_BASE64,
        "modelType": model_type,
    }


async def run_single_request(
    client: httpx.AsyncClient,
    index: int,
    model_type: str,
    include_trace_header: bool,
) -> tuple[int, float]:
    headers = {"x-trace-id": f"bench-{index}"} if include_trace_header else None
    started = time.perf_counter()
    response = await client.post("/ai/predictions/process", json=build_payload(index, model_type), headers=headers)
    elapsed_ms = (time.perf_counter() - started) * 1000
    return response.status_code, elapsed_ms


async def run_load(
    total_requests: int,
    concurrency: int,
    model_type: str,
    include_trace_header: bool,
) -> tuple[Counter, list[float], float]:
    semaphore = asyncio.Semaphore(concurrency)
    status_counter: Counter = Counter()
    latencies: list[float] = []
    started = time.perf_counter()

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://benchmarkserver") as client:
        async def run_guarded(index: int) -> None:
            async with semaphore:
                status_code, latency_ms = await run_single_request(
                    client,
                    index,
                    model_type,
                    include_trace_header,
                )
                status_counter[status_code] += 1
                latencies.append(latency_ms)

        await asyncio.gather(*(run_guarded(index) for index in range(total_requests)))

    elapsed_seconds = time.perf_counter() - started
    return status_counter, latencies, elapsed_seconds


async def benchmark(
    runs: int,
    warmup_runs: int,
    total_requests: int,
    concurrency: int,
    model_type: str,
    include_trace_header: bool,
) -> dict[str, object]:
    warmup_results: list[dict[str, float]] = []
    measured_results: list[dict[str, float]] = []
    measured_status_counts: list[dict[int, int]] = []

    for warmup_index in range(warmup_runs):
        status_counter, latencies, elapsed_seconds = await run_load(
            total_requests,
            concurrency,
            model_type,
            include_trace_header,
        )
        summary = build_performance_summary(latencies, elapsed_seconds)
        summary["elapsedSeconds"] = round(elapsed_seconds, 2)
        warmup_results.append(summary)
        print(
            {
                "phase": "warmup",
                "run": warmup_index + 1,
                "summary": summary,
                "statusCounts": dict(status_counter),
            }
        )

    for run_index in range(runs):
        status_counter, latencies, elapsed_seconds = await run_load(
            total_requests,
            concurrency,
            model_type,
            include_trace_header,
        )
        summary = build_performance_summary(latencies, elapsed_seconds)
        summary["elapsedSeconds"] = round(elapsed_seconds, 2)
        measured_results.append(summary)
        measured_status_counts.append(dict(status_counter))
        print(
            {
                "phase": "measured",
                "run": run_index + 1,
                "summary": summary,
                "statusCounts": dict(status_counter),
            }
        )

    avg_p50 = statistics.mean(float(item["p50LatencyMs"]) for item in measured_results)
    avg_p95 = statistics.mean(float(item["p95LatencyMs"]) for item in measured_results)
    avg_p99 = statistics.mean(float(item["p99LatencyMs"]) for item in measured_results)
    avg_throughput = statistics.mean(float(item["throughputRps"]) for item in measured_results)
    max_p95 = max(float(item["p95LatencyMs"]) for item in measured_results)
    min_throughput = min(float(item["throughputRps"]) for item in measured_results)
    aggregated_status_counter: Counter = Counter()
    for run_status in measured_status_counts:
        aggregated_status_counter.update(run_status)

    return {
        "modelType": model_type,
        "runs": runs,
        "warmupRuns": warmup_runs,
        "totalRequestsPerRun": total_requests,
        "concurrency": concurrency,
        "includeTraceHeader": include_trace_header,
        "aggregate": {
            "avgP50LatencyMs": round(avg_p50, 2),
            "avgP95LatencyMs": round(avg_p95, 2),
            "avgP99LatencyMs": round(avg_p99, 2),
            "avgThroughputRps": round(avg_throughput, 2),
            "maxP95LatencyMs": round(max_p95, 2),
            "minThroughputRps": round(min_throughput, 2),
            "statusCounts": dict(aggregated_status_counter),
        },
        "measuredRuns": measured_results,
        "warmupRunsSummary": warmup_results,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Benchmark inference endpoint with warmup and repeated runs")
    parser.add_argument("--runs", type=int, default=3, help="Measured benchmark runs")
    parser.add_argument("--warmup-runs", type=int, default=1, help="Warmup runs before measuring")
    parser.add_argument("--total-requests", type=int, default=400, help="Requests per run")
    parser.add_argument("--concurrency", type=int, default=40, help="Concurrent workers")
    parser.add_argument(
        "--model-type",
        choices=["cnn", "unet"],
        default="cnn",
        help="Model type to benchmark",
    )
    parser.add_argument(
        "--without-trace-header",
        action="store_true",
        help="Do not include x-trace-id header",
    )
    parser.add_argument(
        "--output-json",
        default="",
        help="Optional output file path for benchmark report JSON",
    )
    args = parser.parse_args()

    if args.runs <= 0:
        raise SystemExit("runs debe ser mayor a 0")
    if args.total_requests <= 0:
        raise SystemExit("total-requests debe ser mayor a 0")
    if args.concurrency <= 0:
        raise SystemExit("concurrency debe ser mayor a 0")

    report = asyncio.run(
        benchmark(
            runs=args.runs,
            warmup_runs=max(args.warmup_runs, 0),
            total_requests=args.total_requests,
            concurrency=args.concurrency,
            model_type=args.model_type,
            include_trace_header=not args.without_trace_header,
        )
    )
    output_payload = {"status": "ok", "benchmarkReport": report}
    if args.output_json:
        output_path = Path(args.output_json)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(output_payload, ensure_ascii=True, indent=2), encoding="utf-8")
        output_payload["outputJsonPath"] = str(output_path)
    print(output_payload)


if __name__ == "__main__":
    main()

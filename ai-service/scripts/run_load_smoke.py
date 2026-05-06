import argparse
import asyncio
import os
import sys
import time
from collections import Counter
from pathlib import Path

import httpx

sys.path.append(str(Path(__file__).resolve().parents[1]))

# Keep rate limiting out of the way for local benchmark runs.
os.environ.setdefault("AI_RATE_LIMIT_REQUESTS", "100000")
os.environ.setdefault("AI_RATE_LIMIT_WINDOW_SECONDS", "60")

from app.main import app
from app.services.observability.performance_service import build_performance_summary

VALID_PNG_BASE64 = (
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8A"
    "An8B9p87sQAAAABJRU5ErkJggg=="
)


def build_payload(index: int) -> dict[str, str]:
    return {
        "tenantId": "tenant-load",
        "patientId": f"patient-{index}",
        "encounterId": f"encounter-{index}",
        "imageName": "image.png",
        "mimeType": "image/png",
        "imageBase64": VALID_PNG_BASE64,
        "modelType": "cnn",
    }


async def run_single_request(client: httpx.AsyncClient, index: int) -> tuple[int, float]:
    started = time.perf_counter()
    response = await client.post("/ai/predictions/process", json=build_payload(index))
    elapsed_ms = (time.perf_counter() - started) * 1000
    return response.status_code, elapsed_ms


async def run_load(total_requests: int, concurrency: int) -> tuple[Counter, list[float], float]:
    semaphore = asyncio.Semaphore(concurrency)
    status_counter: Counter = Counter()
    latencies: list[float] = []
    started = time.perf_counter()

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://loadtestserver") as client:
        async def run_guarded(index: int) -> None:
            async with semaphore:
                status_code, latency_ms = await run_single_request(client, index)
                status_counter[status_code] += 1
                latencies.append(latency_ms)

        await asyncio.gather(*(run_guarded(index) for index in range(total_requests)))

    elapsed_seconds = time.perf_counter() - started
    return status_counter, latencies, elapsed_seconds


def main() -> None:
    parser = argparse.ArgumentParser(description="Run local load smoke test for prediction endpoint")
    parser.add_argument(
        "--total-requests",
        type=int,
        default=int(os.getenv("AI_LOAD_TOTAL_REQUESTS", "200")),
        help="Total number of requests to execute",
    )
    parser.add_argument(
        "--concurrency",
        type=int,
        default=int(os.getenv("AI_LOAD_CONCURRENCY", "20")),
        help="Number of concurrent workers",
    )
    parser.add_argument(
        "--max-p95-ms",
        type=float,
        default=float(os.getenv("AI_LOAD_MAX_P95_MS", "80")),
        help="Maximum allowed p95 latency in milliseconds",
    )
    parser.add_argument(
        "--min-throughput-rps",
        type=float,
        default=float(os.getenv("AI_LOAD_MIN_THROUGHPUT_RPS", "50")),
        help="Minimum allowed throughput in requests/second",
    )
    args = parser.parse_args()

    status_counter, latencies, elapsed_seconds = asyncio.run(
        run_load(args.total_requests, args.concurrency)
    )
    summary = build_performance_summary(latencies, elapsed_seconds)
    summary["elapsedSeconds"] = round(elapsed_seconds, 2)
    summary["statusCounts"] = dict(status_counter)

    alerts: list[str] = []
    if summary["p95LatencyMs"] > args.max_p95_ms:
        alerts.append(f"p95_latency_exceeded:{summary['p95LatencyMs']}>{args.max_p95_ms}")
    if summary["throughputRps"] < args.min_throughput_rps:
        alerts.append(f"throughput_below_min:{summary['throughputRps']}<{args.min_throughput_rps}")
    if int(status_counter.get(200, 0)) != args.total_requests:
        alerts.append(f"non_200_responses:{dict(status_counter)}")

    if alerts:
        print({"status": "alert", "summary": summary, "alerts": alerts})
        raise SystemExit(2)

    print({"status": "ok", "summary": summary, "alerts": []})


if __name__ == "__main__":
    main()

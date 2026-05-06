import json
import os
import platform
import subprocess
import sys
import tempfile
from pathlib import Path
import shutil
from datetime import UTC, datetime


def run_step(name: str, command: list[str]) -> None:
    print({"step": name, "command": " ".join(command)})
    result = subprocess.run(command, check=False)
    if result.returncode != 0:
        raise SystemExit(result.returncode)


def _persist_benchmark_artifacts(
    baseline_path: Path,
    candidate_path: Path,
    destination_dir: Path,
    metadata: dict[str, object],
) -> tuple[Path, Path]:
    destination_dir.mkdir(parents=True, exist_ok=True)
    persisted_baseline = destination_dir / "baseline_benchmark.json"
    persisted_candidate = destination_dir / "candidate_benchmark.json"
    metadata_path = destination_dir / "metadata.json"
    shutil.copyfile(baseline_path, persisted_baseline)
    shutil.copyfile(candidate_path, persisted_candidate)
    metadata_path.write_text(
        json.dumps(metadata, ensure_ascii=True, indent=2),
        encoding="utf-8",
    )
    return persisted_baseline, persisted_candidate


def main() -> None:
    run_step("unit_and_integration_tests", [sys.executable, "-m", "unittest", "discover", "-s", "tests", "-p", "test_*.py"])
    run_step(
        "load_smoke",
        [
            sys.executable,
            "scripts/run_load_smoke.py",
            "--total-requests",
            "120",
            "--concurrency",
            "20",
            "--max-p95-ms",
            "500",
            "--min-throughput-rps",
            "10",
        ],
    )
    benchmark_total_requests = os.getenv("AI_BENCHMARK_TOTAL_REQUESTS", "120")
    benchmark_concurrency = os.getenv("AI_BENCHMARK_CONCURRENCY", "20")
    benchmark_runs = os.getenv("AI_BENCHMARK_RUNS", "1")
    benchmark_warmup_runs = os.getenv("AI_BENCHMARK_WARMUP_RUNS", "0")
    max_p95_regression_pct = os.getenv("AI_BENCHMARK_MAX_P95_REGRESSION_PCT", "10")
    max_p99_regression_pct = os.getenv("AI_BENCHMARK_MAX_P99_REGRESSION_PCT", "10")
    max_throughput_drop_pct = os.getenv("AI_BENCHMARK_MAX_THROUGHPUT_DROP_PCT", "10")
    benchmark_artifacts_dir = Path(os.getenv("AI_BENCHMARK_ARTIFACTS_DIR", "benchmarks/ci-artifacts"))
    persist_on_success = os.getenv("AI_BENCHMARK_PERSIST_ON_SUCCESS", "false").lower() == "true"
    benchmark_metadata = {
        "generatedAtUtc": datetime.now(UTC).isoformat(),
        "gitCommitSha": os.getenv("CI_COMMIT_SHA", os.getenv("GIT_COMMIT", "unknown")),
        "gitBranch": os.getenv("CI_BRANCH", os.getenv("GIT_BRANCH", "unknown")),
        "pythonVersion": sys.version,
        "platform": platform.platform(),
        "benchmarkConfig": {
            "totalRequests": benchmark_total_requests,
            "concurrency": benchmark_concurrency,
            "runs": benchmark_runs,
            "warmupRuns": benchmark_warmup_runs,
            "maxP95RegressionPct": max_p95_regression_pct,
            "maxP99RegressionPct": max_p99_regression_pct,
            "maxThroughputDropPct": max_throughput_drop_pct,
        },
    }

    with tempfile.TemporaryDirectory() as temp_dir:
        benchmark_dir = Path(temp_dir)
        baseline_path = benchmark_dir / "baseline_benchmark.json"
        candidate_path = benchmark_dir / "candidate_benchmark.json"

        benchmark_command = [
            sys.executable,
            "scripts/benchmark_inference.py",
            "--runs",
            benchmark_runs,
            "--warmup-runs",
            benchmark_warmup_runs,
            "--total-requests",
            benchmark_total_requests,
            "--concurrency",
            benchmark_concurrency,
            "--model-type",
            "cnn",
        ]
        run_step(
            "benchmark_baseline",
            [*benchmark_command, "--output-json", str(baseline_path)],
        )
        run_step(
            "benchmark_candidate",
            [*benchmark_command, "--output-json", str(candidate_path)],
        )
        regression_command = [
            sys.executable,
            "scripts/compare_benchmarks.py",
            "--baseline",
            str(baseline_path),
            "--candidate",
            str(candidate_path),
            "--max-p95-regression-pct",
            max_p95_regression_pct,
            "--max-p99-regression-pct",
            max_p99_regression_pct,
            "--max-throughput-drop-pct",
            max_throughput_drop_pct,
        ]
        print({"step": "benchmark_regression_check", "command": " ".join(regression_command)})
        regression_result = subprocess.run(regression_command, check=False)
        if regression_result.returncode != 0:
            persisted_baseline, persisted_candidate = _persist_benchmark_artifacts(
                baseline_path,
                candidate_path,
                benchmark_artifacts_dir,
                benchmark_metadata,
            )
            print(
                {
                    "event": "benchmark_artifacts_persisted",
                    "reason": "regression_detected",
                    "baselinePath": str(persisted_baseline),
                    "candidatePath": str(persisted_candidate),
                }
            )
            raise SystemExit(regression_result.returncode)
        if persist_on_success:
            persisted_baseline, persisted_candidate = _persist_benchmark_artifacts(
                baseline_path,
                candidate_path,
                benchmark_artifacts_dir,
                benchmark_metadata,
            )
            print(
                {
                    "event": "benchmark_artifacts_persisted",
                    "reason": "persist_on_success",
                    "baselinePath": str(persisted_baseline),
                    "candidatePath": str(persisted_candidate),
                }
            )

    print({"status": "ok", "message": "CI verification completed successfully"})


if __name__ == "__main__":
    main()

def percentile(values: list[float], percentile_value: float) -> float:
    if not values:
        return 0.0
    sorted_values = sorted(values)
    index = int(round((len(sorted_values) - 1) * percentile_value))
    return float(sorted_values[index])


def build_performance_summary(latency_ms_values: list[float], elapsed_seconds: float) -> dict[str, float]:
    total_requests = len(latency_ms_values)
    avg_latency = (sum(latency_ms_values) / total_requests) if total_requests else 0.0
    throughput_rps = (total_requests / elapsed_seconds) if elapsed_seconds > 0 else 0.0
    return {
        "totalRequests": float(total_requests),
        "avgLatencyMs": round(avg_latency, 2),
        "p50LatencyMs": round(percentile(latency_ms_values, 0.50), 2),
        "p95LatencyMs": round(percentile(latency_ms_values, 0.95), 2),
        "p99LatencyMs": round(percentile(latency_ms_values, 0.99), 2),
        "throughputRps": round(throughput_rps, 2),
    }

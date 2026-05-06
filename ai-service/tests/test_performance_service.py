import unittest

from app.services.observability.performance_service import build_performance_summary, percentile


class PerformanceServiceTests(unittest.TestCase):
    def test_percentile_should_return_zero_for_empty_values(self) -> None:
        self.assertEqual(percentile([], 0.95), 0.0)

    def test_build_performance_summary_should_calculate_expected_fields(self) -> None:
        latencies = [10.0, 20.0, 30.0, 40.0, 50.0]
        summary = build_performance_summary(latencies, elapsed_seconds=1.0)

        self.assertEqual(summary["totalRequests"], 5.0)
        self.assertEqual(summary["avgLatencyMs"], 30.0)
        self.assertEqual(summary["p50LatencyMs"], 30.0)
        self.assertEqual(summary["p95LatencyMs"], 50.0)
        self.assertEqual(summary["p99LatencyMs"], 50.0)
        self.assertEqual(summary["throughputRps"], 5.0)


if __name__ == "__main__":
    unittest.main()

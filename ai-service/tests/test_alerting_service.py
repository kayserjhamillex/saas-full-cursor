import unittest

from app.services.observability.alerting_service import (
    evaluate_prediction_alerts,
    parse_prometheus_text_metrics,
)


class AlertingServiceTests(unittest.TestCase):
    def test_parse_prometheus_text_metrics(self) -> None:
        metrics_text = "\n".join(
            [
                "ai_prediction_requests_total 100",
                "ai_prediction_requests_error_total 7",
                "ai_prediction_requests_p95_duration_ms 240.5",
            ]
        )

        parsed = parse_prometheus_text_metrics(metrics_text)

        self.assertEqual(parsed["ai_prediction_requests_total"], 100.0)
        self.assertEqual(parsed["ai_prediction_requests_error_total"], 7.0)
        self.assertEqual(parsed["ai_prediction_requests_p95_duration_ms"], 240.5)

    def test_evaluate_prediction_alerts_should_trigger_error_rate_and_latency(self) -> None:
        metrics_text = "\n".join(
            [
                "ai_prediction_requests_total 100",
                "ai_prediction_requests_error_total 10",
                "ai_prediction_requests_p95_duration_ms 250",
            ]
        )

        alerts = evaluate_prediction_alerts(
            metrics_text=metrics_text,
            max_error_rate=0.05,
            max_p95_ms=200,
            min_requests_for_alert=20,
        )

        self.assertEqual(len(alerts), 2)
        self.assertTrue(any(alert.startswith("error_rate_exceeded:") for alert in alerts))
        self.assertTrue(any(alert.startswith("p95_latency_exceeded:") for alert in alerts))

    def test_evaluate_prediction_alerts_should_skip_when_not_enough_requests(self) -> None:
        metrics_text = "\n".join(
            [
                "ai_prediction_requests_total 5",
                "ai_prediction_requests_error_total 5",
                "ai_prediction_requests_p95_duration_ms 999",
            ]
        )

        alerts = evaluate_prediction_alerts(
            metrics_text=metrics_text,
            max_error_rate=0.01,
            max_p95_ms=10,
            min_requests_for_alert=20,
        )

        self.assertEqual(alerts, [])


if __name__ == "__main__":
    unittest.main()

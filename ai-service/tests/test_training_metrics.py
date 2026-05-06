import unittest

from training.metrics import build_metrics


class TrainingMetricsTests(unittest.TestCase):
    def test_build_metrics_happy_path(self) -> None:
        y_true = [1, 1, 0, 0]
        y_pred = [1, 0, 0, 0]

        metrics = build_metrics(y_true, y_pred)

        self.assertEqual(metrics.accuracy, 0.75)
        self.assertEqual(metrics.precision, 1.0)
        self.assertEqual(metrics.recall, 0.5)

    def test_build_metrics_without_positive_predictions(self) -> None:
        y_true = [1, 0]
        y_pred = [0, 0]

        metrics = build_metrics(y_true, y_pred)

        self.assertEqual(metrics.precision, 0.0)
        self.assertEqual(metrics.recall, 0.0)

    def test_build_metrics_should_fail_with_empty_inputs(self) -> None:
        with self.assertRaises(ValueError):
            build_metrics([], [])


if __name__ == "__main__":
    unittest.main()

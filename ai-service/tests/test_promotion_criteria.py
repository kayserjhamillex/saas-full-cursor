import unittest

from training.promotion_service import validate_promotion_criteria
from training.schemas import EvaluationMetrics


class PromotionCriteriaTests(unittest.TestCase):
    def test_should_accept_metrics_when_all_thresholds_are_met(self) -> None:
        metrics = EvaluationMetrics(accuracy=0.9, precision=0.85, recall=0.88)

        validate_promotion_criteria(
            metrics=metrics,
            min_accuracy=0.8,
            min_precision=0.8,
            min_recall=0.8,
        )

    def test_should_fail_when_any_threshold_is_not_met(self) -> None:
        metrics = EvaluationMetrics(accuracy=0.82, precision=0.72, recall=0.9)

        with self.assertRaises(RuntimeError) as context:
            validate_promotion_criteria(
                metrics=metrics,
                min_accuracy=0.8,
                min_precision=0.75,
                min_recall=0.85,
            )

        self.assertIn("precision=0.72 < 0.75", str(context.exception))


if __name__ == "__main__":
    unittest.main()

from training.schemas import EvaluationMetrics


def validate_promotion_criteria(
    metrics: EvaluationMetrics,
    min_accuracy: float,
    min_precision: float,
    min_recall: float,
) -> None:
    failures: list[str] = []
    if metrics.accuracy < min_accuracy:
        failures.append(f"accuracy={metrics.accuracy} < {min_accuracy}")
    if metrics.precision < min_precision:
        failures.append(f"precision={metrics.precision} < {min_precision}")
    if metrics.recall < min_recall:
        failures.append(f"recall={metrics.recall} < {min_recall}")

    if failures:
        failure_text = ", ".join(failures)
        raise RuntimeError(f"Modelo no promovido. Criterios incumplidos: {failure_text}")

from training.schemas import EvaluationMetrics


def build_metrics(y_true: list[int], y_pred: list[int]) -> EvaluationMetrics:
    if len(y_true) != len(y_pred):
        raise ValueError("y_true y y_pred deben tener el mismo tamano")
    if not y_true:
        raise ValueError("No hay datos para calcular metricas")

    true_positive = sum(1 for real, pred in zip(y_true, y_pred) if real == 1 and pred == 1)
    true_negative = sum(1 for real, pred in zip(y_true, y_pred) if real == 0 and pred == 0)
    false_positive = sum(1 for real, pred in zip(y_true, y_pred) if real == 0 and pred == 1)
    false_negative = sum(1 for real, pred in zip(y_true, y_pred) if real == 1 and pred == 0)

    total = len(y_true)
    accuracy = (true_positive + true_negative) / total
    precision_denominator = true_positive + false_positive
    recall_denominator = true_positive + false_negative

    precision = true_positive / precision_denominator if precision_denominator else 0.0
    recall = true_positive / recall_denominator if recall_denominator else 0.0

    return EvaluationMetrics(
        accuracy=round(accuracy, 4),
        precision=round(precision, 4),
        recall=round(recall, 4),
    )

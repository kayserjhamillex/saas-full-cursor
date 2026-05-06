import os

from training.artifact_store import persist_artifacts
from training.dataset_loader import load_samples
from training.promotion_service import validate_promotion_criteria
from training.trainer import train_threshold_model


def run_training_pipeline() -> None:
    dataset_path = os.getenv("AI_TRAINING_DATASET_PATH", "training/data/training_dataset.json")
    output_dir = os.getenv("AI_MODEL_OUTPUT_DIR", "models")
    model_version = os.getenv("AI_CNN_MODEL_VERSION", "cnn-0.1.0")
    min_accuracy = float(os.getenv("AI_MODEL_MIN_ACCURACY", "0.7"))
    min_precision = float(os.getenv("AI_MODEL_MIN_PRECISION", "0.7"))
    min_recall = float(os.getenv("AI_MODEL_MIN_RECALL", "0.7"))

    samples = load_samples(dataset_path)
    artifact, metrics = train_threshold_model(samples, model_version)

    validate_promotion_criteria(
        metrics=metrics,
        min_accuracy=min_accuracy,
        min_precision=min_precision,
        min_recall=min_recall,
    )

    promotion_criteria = {
        "minAccuracy": min_accuracy,
        "minPrecision": min_precision,
        "minRecall": min_recall,
    }
    model_path, report_path, promotion_path = persist_artifacts(
        output_dir,
        artifact,
        metrics,
        promotion_criteria,
    )

    print(
        {
            "event": "training_completed",
            "modelVersion": model_version,
            "threshold": artifact.threshold,
            "weights": artifact.weights,
            "bias": artifact.bias,
            "accuracy": metrics.accuracy,
            "precision": metrics.precision,
            "recall": metrics.recall,
            "modelPath": model_path,
            "reportPath": report_path,
            "promotionPath": promotion_path,
        }
    )


if __name__ == "__main__":
    run_training_pipeline()

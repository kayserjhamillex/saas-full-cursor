import json
from dataclasses import asdict
from datetime import UTC, datetime
from pathlib import Path

from training.schemas import EvaluationMetrics, ModelArtifact


def persist_artifacts(
    output_dir: str,
    model_artifact: ModelArtifact,
    metrics: EvaluationMetrics,
    promotion_criteria: dict[str, float],
) -> tuple[str, str, str]:
    target_dir = Path(output_dir)
    target_dir.mkdir(parents=True, exist_ok=True)

    model_path = target_dir / f"cnn_{model_artifact.version}.json"
    report_path = target_dir / f"cnn_{model_artifact.version}_metrics.json"
    promotion_path = target_dir / f"cnn_{model_artifact.version}_promotion.json"

    existing_paths = [path for path in (model_path, report_path, promotion_path) if path.exists()]
    if existing_paths:
        existing_names = ", ".join(path.name for path in existing_paths)
        raise FileExistsError(f"No se permite sobreescribir artefactos existentes: {existing_names}")

    _write_json_atomically(model_path, asdict(model_artifact))

    _write_json_atomically(
        report_path,
        {
            "modelVersion": model_artifact.version,
            "generatedAtUtc": datetime.now(UTC).isoformat(),
            "metrics": asdict(metrics),
        },
    )

    _write_json_atomically(
        promotion_path,
        {
            "modelVersion": model_artifact.version,
            "promotedAtUtc": datetime.now(UTC).isoformat(),
            "criteria": promotion_criteria,
            "observedMetrics": asdict(metrics),
            "approved": True,
        },
    )

    return str(model_path), str(report_path), str(promotion_path)


def _write_json_atomically(target_path: Path, payload: dict) -> None:
    temp_path = target_path.with_suffix(f"{target_path.suffix}.tmp")
    with temp_path.open("w", encoding="utf-8") as output_file:
        json.dump(payload, output_file, ensure_ascii=True, indent=2)
    temp_path.replace(target_path)

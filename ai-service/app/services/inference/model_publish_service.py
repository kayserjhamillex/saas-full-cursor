import hashlib
import json
import os
import shutil
from pathlib import Path

from app.services.inference.model_registry_store import set_active_cnn_model_version


def publish_cnn_model_artifact(
    source_model_path: str,
    version: str,
    expected_sha256: str | None = None,
    promote: bool = False,
    promote_reason: str = "publish_model",
    dry_run: bool = False,
    strict_json_schema: bool = True,
) -> dict[str, str]:
    normalized_version = version.strip()
    if not normalized_version:
        raise ValueError("La version no puede estar vacia")

    source_path = Path(source_model_path)
    if not source_path.exists():
        raise ValueError(f"No existe el artefacto de origen: {source_model_path}")

    source_sha256 = _compute_sha256(source_path)
    if expected_sha256 and source_sha256.lower() != expected_sha256.strip().lower():
        raise ValueError("Checksum SHA256 no coincide con el artefacto de origen")

    if strict_json_schema:
        _validate_model_json_schema(source_path)

    model_output_dir = Path(os.getenv("AI_MODEL_OUTPUT_DIR", "models"))
    model_output_dir.mkdir(parents=True, exist_ok=True)
    target_model_path = model_output_dir / f"cnn_{normalized_version}.json"
    if target_model_path.exists():
        raise FileExistsError(f"Ya existe artefacto publicado para la version {normalized_version}")
    if dry_run:
        return {
            "publishedModelPath": str(target_model_path),
            "publishedModelVersion": normalized_version,
            "sha256": source_sha256,
            "manifestPath": "",
            "dryRun": "true",
        }

    temp_target_path = target_model_path.with_suffix(f"{target_model_path.suffix}.tmp")
    shutil.copyfile(source_path, temp_target_path)
    temp_target_path.replace(target_model_path)

    manifest_path = ""
    try:
        if promote:
            manifest_path = set_active_cnn_model_version(normalized_version, promote_reason)
    except Exception:
        target_model_path.unlink(missing_ok=True)
        raise

    return {
        "publishedModelPath": str(target_model_path),
        "publishedModelVersion": normalized_version,
        "sha256": source_sha256,
        "manifestPath": manifest_path,
        "dryRun": "false",
    }


def _compute_sha256(file_path: Path) -> str:
    digest = hashlib.sha256()
    with file_path.open("rb") as model_file:
        while True:
            chunk = model_file.read(8192)
            if not chunk:
                break
            digest.update(chunk)
    return digest.hexdigest()


def _validate_model_json_schema(source_path: Path) -> None:
    try:
        payload = json.loads(source_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError("El artefacto de modelo no contiene JSON valido") from exc

    if not isinstance(payload, dict):
        raise ValueError("El artefacto debe ser un objeto JSON")

    required_fields = {"weights", "bias", "threshold"}
    missing_fields = sorted(required_fields - set(payload.keys()))
    if missing_fields:
        raise ValueError(f"Faltan campos requeridos en artefacto: {', '.join(missing_fields)}")

    weights = payload.get("weights")
    if not isinstance(weights, list) or not weights:
        raise ValueError("El campo weights debe ser una lista no vacia")
    try:
        [float(weight) for weight in weights]
    except (TypeError, ValueError) as exc:
        raise ValueError("Todos los pesos deben ser numericos") from exc

    try:
        float(payload.get("bias"))
    except (TypeError, ValueError) as exc:
        raise ValueError("El campo bias debe ser numerico") from exc

    try:
        threshold = float(payload.get("threshold"))
    except (TypeError, ValueError) as exc:
        raise ValueError("El campo threshold debe ser numerico") from exc
    if threshold < 0 or threshold > 1:
        raise ValueError("El campo threshold debe estar entre 0 y 1")

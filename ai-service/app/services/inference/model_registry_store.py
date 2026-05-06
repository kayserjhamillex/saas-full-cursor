import json
import os
from datetime import UTC, datetime
from pathlib import Path

_manifest_cache: dict[str, object] = {
    "path": None,
    "mtime_ns": None,
    "payload": None,
}


def get_active_model_manifest_path() -> Path:
    return Path(os.getenv("AI_ACTIVE_MODEL_MANIFEST_PATH", "models/active_model.json"))


def get_active_cnn_model_version(default_version: str) -> str:
    manifest_path = get_active_model_manifest_path()
    payload = _read_manifest_payload(manifest_path)
    if payload is None:
        return default_version

    version = str(payload.get("activeCnnModelVersion", "")).strip()
    if not version:
        return default_version
    return version


def set_active_cnn_model_version(version: str, reason: str) -> str:
    normalized_version = version.strip()
    if not normalized_version:
        raise ValueError("La version activa no puede estar vacia")
    if not str(reason).strip():
        raise ValueError("El motivo de promocion no puede estar vacio")

    model_dir = Path(os.getenv("AI_MODEL_OUTPUT_DIR", "models"))
    model_artifact_path = model_dir / f"cnn_{normalized_version}.json"
    if not model_artifact_path.exists():
        raise ValueError(f"No existe artefacto para la version solicitada: {normalized_version}")

    manifest_path = get_active_model_manifest_path()
    manifest_path.parent.mkdir(parents=True, exist_ok=True)

    previous_version = None
    if manifest_path.exists():
        with manifest_path.open("r", encoding="utf-8") as current_manifest_file:
            current_payload = json.load(current_manifest_file)
            previous_version = current_payload.get("activeCnnModelVersion")

    payload = {
        "activeCnnModelVersion": normalized_version,
        "previousCnnModelVersion": previous_version,
        "updatedAtUtc": datetime.now(UTC).isoformat(),
        "reason": reason,
    }
    temp_manifest_path = manifest_path.with_suffix(f"{manifest_path.suffix}.tmp")
    with temp_manifest_path.open("w", encoding="utf-8") as manifest_file:
        json.dump(payload, manifest_file, ensure_ascii=True, indent=2)
    temp_manifest_path.replace(manifest_path)
    _invalidate_manifest_cache()

    return str(manifest_path)


def rollback_active_cnn_model_version(reason: str) -> str:
    manifest_path = get_active_model_manifest_path()
    if not manifest_path.exists():
        raise ValueError("No existe manifiesto de modelo activo para rollback")

    with manifest_path.open("r", encoding="utf-8") as manifest_file:
        payload = json.load(manifest_file)

    previous_version = str(payload.get("previousCnnModelVersion", "")).strip()
    if not previous_version:
        raise ValueError("No hay version previa disponible para rollback")

    return set_active_cnn_model_version(previous_version, reason)


def _read_manifest_payload(manifest_path: Path) -> dict[str, object] | None:
    if not manifest_path.exists():
        return None

    current_mtime_ns = manifest_path.stat().st_mtime_ns
    cached_path = _manifest_cache["path"]
    cached_mtime_ns = _manifest_cache["mtime_ns"]
    if cached_path == manifest_path and cached_mtime_ns == current_mtime_ns:
        payload = _manifest_cache["payload"]
        return payload if isinstance(payload, dict) else None

    with manifest_path.open("r", encoding="utf-8") as manifest_file:
        payload = json.load(manifest_file)

    _manifest_cache["path"] = manifest_path
    _manifest_cache["mtime_ns"] = current_mtime_ns
    _manifest_cache["payload"] = payload
    return payload


def _invalidate_manifest_cache() -> None:
    _manifest_cache["path"] = None
    _manifest_cache["mtime_ns"] = None
    _manifest_cache["payload"] = None

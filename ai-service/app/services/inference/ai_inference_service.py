import json
import logging
import time

from app.core.settings import get_settings
from app.models.runtime.cnn_model import run_cnn_prediction
from app.models.runtime.unet_model import run_unet_segmentation
from app.services.inference.contracts import InferenceInput, InferenceOutput
from app.services.inference.errors import InferenceInputError
from app.services.inference.image_service import decode_base64_image, validate_image_payload
from app.services.inference.model_loader_service import get_cnn_model_artifact
from app.services.inference.model_registry_service import get_model_version
from app.utils.postprocessing import build_recommendations
from app.utils.preprocessing import normalize_image_bytes

logger = logging.getLogger("ai-service.inference")


class AIInferenceService:
    def predict(self, inference_input: InferenceInput, trace_id: str | None = None) -> InferenceOutput:
        started_at = time.perf_counter()
        _log_json(
            logging.INFO,
            {
                "event": "inference_started",
                "traceId": trace_id,
                "modelType": inference_input.model_type,
                "mimeType": inference_input.mime_type,
                "imageBase64Length": len(inference_input.image_base64),
            },
        )
        try:
            image_bytes = self._process_input(inference_input)
            model_context = self._load_model(inference_input.model_type)

            cnn_result = run_cnn_prediction(image_bytes, model_context["cnn_artifact"])
            segmentation = (
                run_unet_segmentation(image_bytes) if inference_input.model_type.lower() == "unet" else None
            )

            confidence = float(cnn_result["confidence"])
            risk_level = "high" if confidence >= 0.8 else "medium" if confidence >= 0.5 else "low"
            elapsed_ms = max(int((time.perf_counter() - started_at) * 1000), 1)
            _log_json(
                logging.INFO,
                {
                    "event": "inference_completed",
                    "traceId": trace_id,
                    "modelType": inference_input.model_type,
                    "modelVersion": model_context["model_version"],
                    "imageBytesLength": len(image_bytes),
                    "finding": str(cnn_result["finding"]),
                    "confidence": confidence,
                    "riskLevel": risk_level,
                    "processingMs": elapsed_ms,
                    "hasSegmentation": segmentation is not None,
                },
            )

            return InferenceOutput(
                finding=str(cnn_result["finding"]),
                confidence=confidence,
                risk_level=risk_level,
                recommendations=build_recommendations(str(cnn_result["finding"]), confidence),
                processing_ms=elapsed_ms,
                model_version=model_context["model_version"],
                segmentation=segmentation,
            )
        except InferenceInputError:
            raise
        except Exception as exc:
            logger.exception(
                json.dumps(
                    {
                        "event": "inference_unexpected_error",
                        "traceId": trace_id,
                        "modelType": inference_input.model_type,
                        "mimeType": inference_input.mime_type,
                        "errorType": type(exc).__name__,
                    }
                )
            )
            raise

    def _process_input(self, inference_input: InferenceInput) -> bytes:
        settings = get_settings()
        image_bytes = decode_base64_image(inference_input.image_base64)
        if not image_bytes:
            _log_json(
                logging.WARNING,
                {
                    "event": "inference_input_error",
                    "errorType": "invalid_image_payload",
                    "detail": "Contenido de imagen invalido",
                },
            )
            raise InferenceInputError(
                detail="Contenido de imagen invalido",
                error_type="invalid_image_payload",
            )
        try:
            validate_image_payload(image_bytes, inference_input.mime_type)
        except ValueError as exc:
            detail = str(exc)
            error_type = "invalid_image_payload"
            if "mimeType no coincide" in detail:
                error_type = "mime_type_mismatch"
            elif "no soportado" in detail:
                error_type = "unsupported_image_format"
            elif "demasiado pequeno" in detail:
                error_type = "image_too_small"
            _log_json(
                logging.WARNING,
                {
                    "event": "inference_input_error",
                    "errorType": error_type,
                    "detail": detail,
                },
            )
            raise InferenceInputError(detail=detail, error_type=error_type) from exc
        if len(image_bytes) > settings.max_image_size_bytes:
            _log_json(
                logging.WARNING,
                {
                    "event": "inference_input_error",
                    "errorType": "image_size_limit_exceeded",
                    "detail": "La imagen excede el maximo permitido",
                    "imageBytesLength": len(image_bytes),
                    "maxAllowedBytes": settings.max_image_size_bytes,
                },
            )
            raise InferenceInputError(
                detail="La imagen excede el maximo permitido",
                error_type="image_size_limit_exceeded",
            )
        return normalize_image_bytes(image_bytes)

    def _load_model(self, model_type: str) -> dict[str, object]:
        cnn_artifact = get_cnn_model_artifact()
        if model_type.lower() == "cnn":
            return {
                "cnn_artifact": cnn_artifact,
                "model_version": f"cnn:{cnn_artifact['modelVersion']}",
            }
        return {
            "cnn_artifact": cnn_artifact,
            "model_version": get_model_version(model_type),
        }


def _log_json(level: int, payload: dict[str, object]) -> None:
    if logger.isEnabledFor(level):
        logger.log(level, json.dumps(payload))

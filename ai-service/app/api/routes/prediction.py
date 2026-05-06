import hashlib
import json
import logging

from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse

from app.api.schemas.prediction import ErrorResponse, PredictionRequest, PredictionResponse, PredictionResult
from app.core.settings import get_settings
from app.services.inference.errors import InferenceInputError
from app.services.inference.prediction_service import predict_from_base64_image

router = APIRouter()
logger = logging.getLogger("ai-service.api.prediction")


def _masked_identifier(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()[:12]


@router.post(
    "/predictions/process",
    response_model=PredictionResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Error de validacion del payload de imagen"},
        422: {"model": ErrorResponse, "description": "Error de validacion del esquema de solicitud"},
        429: {"model": ErrorResponse, "description": "Limite de solicitudes excedido"},
    },
)
def process_prediction(payload: PredictionRequest, response: Response, request: Request) -> PredictionResponse:
    trace_id = request.headers.get("x-trace-id")
    current_settings = get_settings()
    request_tenant_id = request.headers.get("x-tenant-id", "").strip()
    if current_settings.require_api_key and request_tenant_id and request_tenant_id != payload.tenantId:
        return JSONResponse(
            status_code=403,
            content={
                "detail": "Tenant invalido para la solicitud",
                "errorType": "tenant_mismatch",
                "errors": [],
            },
            headers={"x-error-type": "tenant_mismatch"},
        )
    logger.info(
        json.dumps(
            {
                "event": "prediction_input_received",
                "traceId": trace_id,
                "tenantId": payload.tenantId,
                "patientIdHash": _masked_identifier(payload.patientId),
                "encounterIdHash": _masked_identifier(payload.encounterId),
                "imageName": payload.imageName,
                "mimeType": payload.mimeType,
                "modelType": payload.modelType,
                "imageBase64Length": len(payload.imageBase64),
                "hasDataUriPrefix": payload.imageBase64.strip().startswith("data:"),
            }
        )
    )

    try:
        prediction_payload = predict_from_base64_image(
            payload.imageBase64,
            payload.modelType,
            payload.mimeType,
            trace_id=trace_id,
        )
    except InferenceInputError as exc:
        logger.warning(
            json.dumps(
                {
                    "event": "prediction_error",
                    "traceId": trace_id,
                    "tenantId": payload.tenantId,
                    "patientIdHash": _masked_identifier(payload.patientId),
                    "encounterIdHash": _masked_identifier(payload.encounterId),
                    "imageName": payload.imageName,
                    "mimeType": payload.mimeType,
                    "modelType": payload.modelType,
                    "errorType": exc.error_type,
                    "detail": exc.detail,
                    "statusCode": exc.status_code,
                }
            )
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail, "errorType": exc.error_type, "errors": []},
            headers={"x-error-type": exc.error_type},
        )

    prediction_result = PredictionResult(**prediction_payload)
    response.headers["x-model-version"] = prediction_result.modelVersion
    logger.info(
        json.dumps(
            {
                "event": "prediction_output_sent",
                "traceId": trace_id,
                "tenantId": payload.tenantId,
                "patientIdHash": _masked_identifier(payload.patientId),
                "encounterIdHash": _masked_identifier(payload.encounterId),
                "imageName": payload.imageName,
                "modelType": payload.modelType,
                "modelVersion": prediction_result.modelVersion,
                "finding": prediction_result.finding,
                "confidence": prediction_result.confidence,
                "riskLevel": prediction_result.riskLevel,
                "processingMs": prediction_result.processingMs,
                "hasSegmentation": prediction_result.segmentation is not None,
            }
        )
    )

    return PredictionResponse(
        tenantId=payload.tenantId,
        patientId=payload.patientId,
        encounterId=payload.encounterId,
        imageName=payload.imageName,
        mimeType=payload.mimeType,
        modelType=payload.modelType,
        result=prediction_result,
    )

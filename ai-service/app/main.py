import json
import logging
import time
import uuid
import hmac

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.api.routes.health import router as health_router
from app.api.routes.metrics import router as metrics_router
from app.api.routes.prediction import router as prediction_router
from app.core.settings import get_settings
from app.services.observability.metrics_service import register_prediction_metric
from app.services.security.network_access_service import is_client_ip_allowed
from app.services.security.rate_limit_service import allow_request, build_rate_limit_key

settings = get_settings()
log_level = getattr(logging, settings.log_level, logging.INFO)
logging.basicConfig(level=log_level, format="%(message)s")
logger = logging.getLogger("ai-service")

app = FastAPI(title="ai-service", version="0.1.0")
app.include_router(prediction_router, prefix="/ai")
app.include_router(health_router)
app.include_router(metrics_router)


def _is_api_key_valid(request: Request, expected_api_key: str, required: bool) -> bool:
    if not required:
        return True
    provided_api_key = request.headers.get("x-api-key", "")
    if not expected_api_key:
        return False
    return hmac.compare_digest(provided_api_key, expected_api_key)


@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(
    _request: Request, exc: RequestValidationError
) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Payload de solicitud invalido",
            "errorType": "request_validation_error",
            "errors": exc.errors(),
        },
        headers={"x-error-type": "request_validation_error"},
    )


@app.middleware("http")
async def tracing_and_json_logs(request: Request, call_next):
    started_at = time.time()
    trace_id = request.headers.get("x-trace-id") or str(uuid.uuid4())
    tenant_id = request.headers.get("x-tenant-id")
    current_settings = get_settings()
    provided_api_key = request.headers.get("x-api-key", "")
    trusted_api_key = (
        provided_api_key
        if current_settings.require_api_key
        and _is_api_key_valid(
            request,
            expected_api_key=current_settings.api_key,
            required=True,
        )
        else None
    )
    client_host = request.client.host if request.client else "unknown"
    rate_limit_key = build_rate_limit_key(client_host=client_host, api_key=trusted_api_key)
    try:
        if request.url.path == "/ai/predictions/process":
            if not _is_api_key_valid(
                request,
                expected_api_key=current_settings.api_key,
                required=current_settings.require_api_key,
            ):
                response = JSONResponse(
                    status_code=401,
                    content={
                        "detail": "No autorizado",
                        "errorType": "unauthorized",
                        "errors": [],
                    },
                    headers={"x-error-type": "unauthorized"},
                )
                response.headers["x-trace-id"] = trace_id
                return response
        if request.url.path == "/metrics":
            if current_settings.metrics_internal_only:
                client_host = request.client.host if request.client else None
                if not is_client_ip_allowed(client_host, current_settings.metrics_allowed_cidrs):
                    response = JSONResponse(
                        status_code=403,
                        content={
                            "detail": "Acceso a metricas restringido a red interna",
                            "errorType": "metrics_access_forbidden",
                            "errors": [],
                        },
                        headers={"x-error-type": "metrics_access_forbidden"},
                    )
                    response.headers["x-trace-id"] = trace_id
                    return response
            if not _is_api_key_valid(
                request,
                expected_api_key=current_settings.api_key,
                required=current_settings.protect_metrics_endpoint,
            ):
                response = JSONResponse(
                    status_code=401,
                    content={
                        "detail": "No autorizado",
                        "errorType": "unauthorized",
                        "errors": [],
                    },
                    headers={"x-error-type": "unauthorized"},
                )
                response.headers["x-trace-id"] = trace_id
                return response

        if request.url.path == "/ai/predictions/process":
            content_length_header = request.headers.get("content-length")
            if content_length_header is not None and content_length_header.isdigit():
                content_length = int(content_length_header)
                if content_length > current_settings.max_request_body_bytes:
                    response = JSONResponse(
                        status_code=413,
                        content={
                            "detail": "Payload demasiado grande",
                            "errorType": "payload_too_large",
                            "errors": [],
                        },
                        headers={"x-error-type": "payload_too_large"},
                    )
                    response.headers["x-trace-id"] = trace_id
                    return response

        if request.method == "POST" and request.url.path == "/ai/predictions/process":
            is_allowed = allow_request(
                key=rate_limit_key,
                max_requests=current_settings.rate_limit_requests,
                window_seconds=current_settings.rate_limit_window_seconds,
            )
            if not is_allowed:
                response = JSONResponse(
                    status_code=429,
                    content={
                        "detail": "Limite de solicitudes excedido. Intenta nuevamente en breve.",
                        "errorType": "rate_limit_exceeded",
                        "errors": [],
                    },
                    headers={"x-error-type": "rate_limit_exceeded"},
                )
                response.headers["x-trace-id"] = trace_id
                return response

        response = await call_next(request)
        response.headers["x-trace-id"] = trace_id
        return response
    finally:
        duration_ms = int((time.time() - started_at) * 1000)
        status_code = locals().get("response").status_code if "response" in locals() else 500
        if request.url.path == "/ai/predictions/process":
            model_version = response.headers.get("x-model-version") if "response" in locals() else None
            error_type = response.headers.get("x-error-type") if "response" in locals() else "internal_error"
            register_prediction_metric(
                status_code=status_code,
                duration_ms=duration_ms,
                model_version=model_version,
                error_type=error_type,
            )
        logger.info(
            json.dumps(
                {
                    "level": "info",
                    "service": "ai-service",
                    "traceId": trace_id,
                    "method": request.method,
                    "path": request.url.path,
                    "statusCode": status_code,
                    "durationMs": duration_ms,
                    "tenantId": tenant_id,
                }
            )
        )

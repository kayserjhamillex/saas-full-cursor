import os
from dataclasses import dataclass


@dataclass(frozen=True)
class AIServiceSettings:
    max_image_size_bytes: int
    log_level: str
    cnn_model_version: str
    unet_model_version: str
    rate_limit_requests: int
    rate_limit_window_seconds: int
    rate_limit_backend: str
    redis_url: str
    max_request_body_bytes: int
    require_api_key: bool
    api_key: str
    protect_metrics_endpoint: bool
    metrics_internal_only: bool
    metrics_allowed_cidrs: list[str]


def get_settings() -> AIServiceSettings:
    return AIServiceSettings(
        max_image_size_bytes=int(os.getenv("AI_MAX_IMAGE_SIZE_BYTES", str(8 * 1024 * 1024))),
        log_level=os.getenv("AI_LOG_LEVEL", "INFO").upper(),
        cnn_model_version=os.getenv("AI_CNN_MODEL_VERSION", "cnn-0.1.0"),
        unet_model_version=os.getenv("AI_UNET_MODEL_VERSION", "unet-0.1.0"),
        rate_limit_requests=int(os.getenv("AI_RATE_LIMIT_REQUESTS", "30")),
        rate_limit_window_seconds=int(os.getenv("AI_RATE_LIMIT_WINDOW_SECONDS", "60")),
        rate_limit_backend=os.getenv("AI_RATE_LIMIT_BACKEND", "memory").lower(),
        redis_url=os.getenv("AI_REDIS_URL", ""),
        max_request_body_bytes=int(os.getenv("AI_MAX_REQUEST_BODY_BYTES", str(12 * 1024 * 1024))),
        require_api_key=os.getenv("AI_REQUIRE_API_KEY", "false").lower() == "true",
        api_key=os.getenv("AI_API_KEY", ""),
        protect_metrics_endpoint=os.getenv("AI_PROTECT_METRICS_ENDPOINT", "false").lower() == "true",
        metrics_internal_only=os.getenv("AI_METRICS_INTERNAL_ONLY", "false").lower() == "true",
        metrics_allowed_cidrs=[
            cidr.strip()
            for cidr in os.getenv("AI_METRICS_ALLOWED_CIDRS", "127.0.0.1/32,::1/128").split(",")
            if cidr.strip()
        ],
    )

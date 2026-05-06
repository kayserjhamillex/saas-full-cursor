from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class PredictionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    tenantId: str = Field(min_length=1)
    patientId: str = Field(min_length=1)
    encounterId: str = Field(min_length=1)
    imageName: str = Field(min_length=1)
    mimeType: Literal["image/png", "image/jpeg", "image/jpg"] = Field(default="image/png")
    imageBase64: str = Field(min_length=10, max_length=16_000_000)
    modelType: Literal["cnn", "unet"] = Field(default="cnn")

    @field_validator("tenantId", "patientId", "encounterId", "imageName")
    @classmethod
    def strip_and_validate_non_empty(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("El campo no puede estar vacio")
        return normalized

    @field_validator("imageBase64")
    @classmethod
    def validate_image_base64_not_blank(cls, value: str) -> str:
        normalized = value.strip()
        if len(normalized) < 10:
            raise ValueError("imageBase64 debe contener datos validos")
        return normalized


class PredictionResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    finding: str
    confidence: float = Field(ge=0.0, le=1.0)
    riskLevel: Literal["low", "medium", "high"]
    recommendations: list[str]
    processingMs: int = Field(ge=1)
    modelVersion: str
    segmentation: dict | None = None


class PredictionResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    tenantId: str
    patientId: str
    encounterId: str
    imageName: str
    mimeType: str
    modelType: str
    result: PredictionResult


class ErrorResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    detail: str
    errorType: str
    errors: list[dict[str, Any]] = Field(default_factory=list)

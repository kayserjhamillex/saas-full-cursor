from dataclasses import dataclass
from typing import Literal


@dataclass(frozen=True)
class InferenceInput:
    image_base64: str
    mime_type: str
    model_type: Literal["cnn", "unet"]


@dataclass(frozen=True)
class InferenceOutput:
    finding: str
    confidence: float
    risk_level: Literal["low", "medium", "high"]
    recommendations: list[str]
    processing_ms: int
    model_version: str
    segmentation: dict | None

    def to_response_payload(self) -> dict:
        return {
            "finding": self.finding,
            "confidence": self.confidence,
            "riskLevel": self.risk_level,
            "recommendations": self.recommendations,
            "processingMs": self.processing_ms,
            "modelVersion": self.model_version,
            "segmentation": self.segmentation,
        }

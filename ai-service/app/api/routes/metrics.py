from fastapi import APIRouter
from fastapi.responses import PlainTextResponse

from app.services.observability.metrics_service import render_metrics_payload

router = APIRouter()


@router.get("/metrics")
def metrics() -> PlainTextResponse:
    return render_metrics_payload()

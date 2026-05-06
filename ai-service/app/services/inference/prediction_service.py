from app.services.inference.ai_inference_service import AIInferenceService
from app.services.inference.contracts import InferenceInput

inference_service = AIInferenceService()


def predict_from_base64_image(
    image_base64: str,
    model_type: str,
    mime_type: str,
    trace_id: str | None = None,
) -> dict:
    inference_input = InferenceInput(
        image_base64=image_base64,
        mime_type=mime_type,
        model_type=model_type.lower(),  # validated at API boundary
    )
    prediction = inference_service.predict(inference_input, trace_id=trace_id)
    return prediction.to_response_payload()

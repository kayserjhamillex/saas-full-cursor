from app.core.settings import get_settings
from app.services.inference.model_registry_store import get_active_cnn_model_version


def get_model_version(model_type: str) -> str:
    settings = get_settings()
    active_cnn_model_version = get_active_cnn_model_version(settings.cnn_model_version)
    normalized_type = model_type.lower()
    if normalized_type == "unet":
        return f"cnn:{active_cnn_model_version},unet:{settings.unet_model_version}"
    return f"cnn:{active_cnn_model_version}"

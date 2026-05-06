import base64
import binascii


def decode_base64_image(content: str) -> bytes:
    clean_content = content.strip()
    if "," in clean_content:
        clean_content = clean_content.split(",", maxsplit=1)[1]
    try:
        return base64.b64decode(clean_content, validate=True)
    except (binascii.Error, ValueError):
        return b""


def detect_image_mime_type(image_bytes: bytes) -> str | None:
    if image_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if image_bytes.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    return None


def validate_image_payload(image_bytes: bytes, declared_mime_type: str) -> None:
    if len(image_bytes) < 16:
        raise ValueError("Contenido de imagen demasiado pequeno")

    detected_mime_type = detect_image_mime_type(image_bytes)
    if detected_mime_type is None:
        raise ValueError("Formato de imagen no soportado")

    normalized_declared_type = "image/jpeg" if declared_mime_type == "image/jpg" else declared_mime_type
    if detected_mime_type != normalized_declared_type:
        raise ValueError("El mimeType no coincide con el contenido de la imagen")

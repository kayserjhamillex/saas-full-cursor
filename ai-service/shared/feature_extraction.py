import base64
import binascii
import math


def decode_base64_bytes(image_base64: str) -> bytes:
    try:
        return base64.b64decode(image_base64, validate=True)
    except (binascii.Error, ValueError) as exc:
        raise ValueError("imageBase64 invalido en dataset") from exc


def extract_feature_vector(image_bytes: bytes) -> list[float]:
    if not image_bytes:
        return [0.0, 0.0, 0.0]

    slice_bytes = image_bytes[:512]
    values = [byte / 255 for byte in slice_bytes]
    count = len(values)
    mean_value = sum(values) / count
    variance = sum((value - mean_value) ** 2 for value in values) / count
    std_value = math.sqrt(variance)
    length_norm = min(len(image_bytes), 1024 * 1024) / float(1024 * 1024)
    return [round(mean_value, 6), round(std_value, 6), round(length_norm, 6)]

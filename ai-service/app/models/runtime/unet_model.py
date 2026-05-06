def run_unet_segmentation(image_bytes: bytes) -> dict[str, object]:
    active_pixels = sum(image_bytes[:512]) if image_bytes else 0
    segmentation_ratio = round((active_pixels % 1000) / 1000, 3)
    return {
        "segmentationRatio": segmentation_ratio,
        "maskGenerated": segmentation_ratio > 0.12,
    }

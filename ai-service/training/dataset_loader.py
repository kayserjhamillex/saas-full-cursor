import json
from pathlib import Path

from training.schemas import TrainingSample


def load_samples(dataset_path: str) -> list[TrainingSample]:
    path = Path(dataset_path)
    if not path.exists():
        raise FileNotFoundError(f"Dataset no encontrado: {dataset_path}")

    with path.open("r", encoding="utf-8") as dataset_file:
        payload = json.load(dataset_file)

    if not isinstance(payload, list):
        raise ValueError("El dataset debe ser una lista de objetos")

    samples: list[TrainingSample] = []
    for index, row in enumerate(payload):
        if not isinstance(row, dict):
            raise ValueError(f"Fila invalida en indice {index}: se esperaba objeto")
        image_base64 = str(row.get("imageBase64", "")).strip()
        label = row.get("label")
        if image_base64 == "":
            raise ValueError(f"Fila invalida en indice {index}: imageBase64 vacio")
        if label not in (0, 1):
            raise ValueError(f"Fila invalida en indice {index}: label debe ser 0 o 1")
        samples.append(TrainingSample(image_base64=image_base64, label=int(label)))

    if not samples:
        raise ValueError("El dataset no contiene muestras")
    return samples

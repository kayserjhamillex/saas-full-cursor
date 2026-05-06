# Training pipeline

Este modulo ejecuta entrenamiento offline separado de la API FastAPI.

## Dataset esperado

Archivo JSON con una lista de objetos:

- `imageBase64`: contenido base64 de la imagen
- `label`: `0` o `1`

Ejemplo: `training/data/training_dataset.example.json`

## Variables de entorno

- `AI_TRAINING_DATASET_PATH`
- `AI_MODEL_OUTPUT_DIR`
- `AI_CNN_MODEL_VERSION`
- `AI_MODEL_MIN_ACCURACY`
- `AI_MODEL_MIN_PRECISION`
- `AI_MODEL_MIN_RECALL`

## Ejecucion

```bash
python -m training.train
```

El pipeline genera:

- `models/cnn_<version>.json`
- `models/cnn_<version>_metrics.json`
- `models/cnn_<version>_promotion.json`

## Metricas de evaluacion

El entrenamiento calcula y guarda:

- `accuracy`: proporcion de predicciones correctas sobre el total.
- `precision`: de los casos predichos como positivos, cuantos eran realmente positivos.
- `recall`: de los casos realmente positivos, cuantos fueron detectados por el modelo.

### Como evaluarlas

- Prioriza `recall` cuando el costo de falsos negativos es alto (ej: no detectar una lesion).
- Prioriza `precision` cuando el costo de falsos positivos es alto (ej: exceso de revisiones manuales).
- Usa `accuracy` como referencia global, nunca de forma aislada en datasets desbalanceados.
- Ajusta umbrales (`AI_MODEL_MIN_ACCURACY`, `AI_MODEL_MIN_PRECISION`, `AI_MODEL_MIN_RECALL`) segun riesgo clinico y capacidad operativa.

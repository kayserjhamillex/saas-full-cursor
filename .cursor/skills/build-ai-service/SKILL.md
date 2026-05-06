---
name: build-ai-service
description: >-
  Construye servicios de IA en Python con FastAPI: separación estricta de
  entrenamiento, inferencia y API, Pydantic, modelo versionado, métricas
  (accuracy, precision, recall) y logging estructurado. Entrega código completo
  y estructura de microservicio. Usar al implementar o arrancar un servicio
  de ML desde cero, al pedir build_ai_service, o al mencionar FastAPI, IA
  con inferencia, pipeline train/serve o API de predicción.
---

# Construcción de servicio de IA (Python / FastAPI)

## Rol

Actuar como **AI Engineer**. Objetivo: un servicio de IA **reproducible**, con capas desacopladas y entregables **completos** (código + estructura + explicación breve).

## Stack fijado

- **Python 3.11+** (o la versión del repo).
- **FastAPI** + **Uvicorn** (o el ASGI del proyecto).
- **Pydantic** v2 para esquemas y configuración.
- **ML** en la librería acordada con el repo (**scikit-learn** por defecto si no se indica otra).

## Separación estricta (nunca mezclar en un solo módulo monolítico)

| Capa | Contenido permitido | Prohibido en esta capa |
|------|---------------------|-------------------------|
| **training** | Carga de datos, split, entrenamiento, evaluación offline, guardado de artefactos (modelo, metadatos, métricas) | Llamar al router HTTP; lógica de `FastAPI` |
| **inference** | Cargar artefacto versionado, pre/post, `predict` / `transform` puro, sin efectos de red | Entrenar o retocar pesos; dependencias de FastAPI |
| **api** | Routers, dependencias, `HTTPException`, mapeo request/response → servicio de inferencia | Lógica ML pesada inline; acceso directo a ficheros de entrenamiento crudos |

- La **ruta de producción** (`api/`) solo **orquesta** y delega a **inference**; el **entrenamiento** vive en scripts o módulo `training/` y no se importa desde el arranque del server salvo en herramientas/CLI.

## Estructura mínima a entregar

Ajustar nombres al monorepo si existe. Plantilla de referencia:

```text
service_ai/
  pyproject.toml o requirements.txt
  .env.example
  app/
    main.py                 # instancia FastAPI, incluye router
    api/
      __init__.py
      routes.py             # o routers/ por dominio
      dependencies.py      # inyección del servicio de inferencia (opcional)
    inference/
      __init__.py
      service.py           # carga de modelo, predict
      schema.py            # Pydantic internos si aplica
    training/
      __init__.py
      train.py             # script o función exportable: entrena y escribe artifacts
  artifacts/               # .gitignore; rutas vía variable de entorno
    (model_*.pkl, metrics.json, manifest o metadata.json)
```

- **Nada** de lógica importante en un único `script_suelto.py` sin paquetes importables.

## Requisitos obligatorios

### Pydantic

- Modelos de **request/response** del API en `api/` o `app/schemas/`.
- **Settings** con `pydantic-settings` o equivalente: rutas a `ARTIFACTS_DIR`, `MODEL_VERSION`, etc.; **cero** secretos ni paths absolutos fijos en código.

### Modelo básico + endpoint

- Incluir al menos **un** modelo entrenable (p. ej. `RandomForestClassifier` o `LogisticRegression`) y **al menos un endpoint** `POST` de predicción (o el verbo acorde al diseño) que use solo la capa de inferencia.

### Métricas (entrenamiento / evaluación offline)

- Tras evaluar, persistir o devolver (según el flujo) al menos: **accuracy**, **precision** y **recall** (macro o binario según el problema; documentar el promediado en un comentario o `metrics.json`).

### Logging

- `logging` estándar: nivel configurable; en inferencia, registrar **versión de modelo** y **errores**; no volcar PII, vectores completos ni payloads sensibles en producción.

## Flujo al implementar (orden mental)

1. **Training**: datos de ejemplo o carga; fit; evaluación con precisión, recall, accuracy; guardar modelo + `metrics` + manifiesto de versión.
2. **Inference**: cargar desde ruta de config; `predict` devuelve tipos o esquemas Pydantic estables.
3. **API**: solo validación HTTP, códigos de error claros, llamada a inferencia, respuesta tipada.

## Entregables

1. **Código completo** y navegable: archivos listos para añadir al repo (o diff coherente).
2. **Variables de entorno** documentadas (`.env.example`: p. ej. `ARTIFACTS_DIR`, `LOG_LEVEL`).
3. **Explicación breve** al final: cómo entrenar, dónde quedan los artefactos, cómo arrancar el API, qué mide cada métrica y qué versión de modelo usa inferencia.

## Comprobación final

- [ ] Tres capas (training / inference / API) con imports que no cruzen responsabilidades.
- [ ] Pydantic en bordes y configuración por entorno.
- [ ] Métricas `accuracy` / `precision` / `recall` en evaluación offline, trazables (archivo o estructura clara).
- [ ] Logging estructurado, sin ruido sensible.
- [ ] Nada de “un solo script gigante” sin `app/`, `inference/`, `training/`.

## Recurso

- Criterios amplios de microservicio, logging y versionado: ver [ai-engineer](../ai-engineer/SKILL.md) en el mismo repositorio.

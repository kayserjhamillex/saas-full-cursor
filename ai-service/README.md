# AI Service

Servicio de inferencia en FastAPI con pipeline de entrenamiento offline separado.

## Comandos de CI local

- Ejecutar toda la suite de tests:

```bash
python -m unittest discover -s tests -p "test_*.py"
```

- Ejecutar pipeline de entrenamiento:

```bash
python -m training.train
```

- Activar una version de modelo CNN:

```bash
python scripts/set_active_model.py --version cnn-0.2.0 --reason "promote_after_validation"
```

- Publicar artefacto de modelo de forma segura (checksum + promocion opcional):

```bash
python scripts/publish_model.py --source-model-path /tmp/cnn_model.json --version cnn-0.2.1 --expected-sha256 <sha256> --promote --reason "release_candidate"
```

Validacion previa sin escritura:

```bash
python scripts/publish_model.py --source-model-path /tmp/cnn_model.json --version cnn-0.2.1 --dry-run
```

Desactivar validacion estricta (solo si tienes una razon controlada):

```bash
python scripts/publish_model.py --source-model-path /tmp/cnn_model.json --version cnn-0.2.1 --no-strict-json-schema
```

- Hacer rollback de modelo activo:

```bash
python scripts/rollback_active_model.py --reason "rollback_after_incident"
```

- Verificar alertas operativas sobre `/metrics`:

```bash
python scripts/check_metrics_alerts.py --metrics-url http://localhost:8000/metrics
```

Sale con codigo `2` cuando detecta alertas (error rate o p95 sobre umbral).

El endpoint `/metrics` tambien publica calidad del modelo activo:

- `ai_model_accuracy{model_version="..."}`
- `ai_model_precision{model_version="..."}`
- `ai_model_recall{model_version="..."}`

Estas metricas se leen desde `models/cnn_<version>_metrics.json` del modelo activo.

- Ejecutar smoke de carga local (baseline p50/p95/p99/throughput):

```bash
python scripts/run_load_smoke.py --total-requests 200 --concurrency 20
```

Sale con codigo `2` si no cumple umbrales de p95 o throughput.

- Ejecutar benchmark reproducible de inferencia (warmup + multiples corridas):

```bash
python scripts/benchmark_inference.py --runs 3 --warmup-runs 1 --total-requests 400 --concurrency 40 --model-type cnn
```

Entrega reporte agregado con p50/p95/p99, throughput y status codes.

Guardar reporte en JSON para comparativas:

```bash
python scripts/benchmark_inference.py --runs 3 --warmup-runs 1 --total-requests 400 --concurrency 40 --model-type cnn --output-json ./benchmarks/cnn_benchmark.json
```

Comparar baseline vs candidate:

```bash
python scripts/compare_benchmarks.py --baseline ./benchmarks/cnn_baseline.json --candidate ./benchmarks/cnn_candidate.json --max-p95-regression-pct 10 --max-throughput-drop-pct 10
```

Retorna codigo `2` si detecta regresion sobre umbrales.

- Ejecutar verificacion CI local (tests + load smoke):

```bash
python scripts/ci_verify.py
```

`ci_verify.py` ahora tambien ejecuta benchmark baseline/candidate y falla si detecta regresion de p95/p99 o throughput segun umbrales.

Cuando detecta regresion, persiste automaticamente los artefactos JSON en `AI_BENCHMARK_ARTIFACTS_DIR` para analisis post-mortem.
Si quieres persistir tambien en corridas exitosas, usa `AI_BENCHMARK_PERSIST_ON_SUCCESS=true`.
Tambien genera `metadata.json` con timestamp UTC, commit SHA, rama y configuracion/umbrales usados.
Incluye ademas `pythonVersion` y `platform` del runner para reproducibilidad.

## Docker (solo ai-service)

Antes de levantar cualquier modo:

1. Crear `.env` segun el entorno:
   - Desarrollo: copiar `.env.example` a `.env`
   - Staging/Produccion: copiar `.env.prod.example` a `.env`
2. Verificar Docker Desktop/daemon activo.

### Modo 1: Desarrollo (default con override)

Usa `docker-compose.yml` + `docker-compose.override.yml` automaticamente.
Incluye hot-reload y Redis para rate limit distribuido.

- Levantar:

```bash
docker compose up --build
```

- Levantar en segundo plano:

```bash
docker compose up --build -d
```

- Ver logs:

```bash
docker compose logs -f ai-service
```

- Detener:

```bash
docker compose down
```

### Modo 2: Desarrollo explicito

Usa solo `docker-compose.dev.yml` (cuando quieres ejecutar ese perfil de forma explicita).

- Levantar:

```bash
docker compose -f docker-compose.dev.yml up --build
```

- Segundo plano:

```bash
docker compose -f docker-compose.dev.yml up --build -d
```

- Detener:

```bash
docker compose -f docker-compose.dev.yml down
```

### Modo 3: Produccion local basica

Usa `docker-compose.yml` sin override (imagen optimizada, sin hot-reload).

- Levantar:

```bash
docker compose -f docker-compose.yml up --build
```

- Segundo plano:

```bash
docker compose -f docker-compose.yml up --build -d
```

- Detener:

```bash
docker compose -f docker-compose.yml down
```

### Modo 4: Produccion endurecida

Usa `docker-compose.prod.yml`.
Incluye Redis + sidecar `prometheus`, limites de recursos, restart policy y `/metrics` restringido por red interna por defecto.

- Levantar:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

- Ver estado:

```bash
docker compose -f docker-compose.prod.yml ps
```

- Ver logs:

```bash
docker compose -f docker-compose.prod.yml logs -f ai-service
```

- Detener:

```bash
docker compose -f docker-compose.prod.yml down
```

### Verificaciones rapidas (todos los modos)

- Healthcheck:

```bash
curl http://localhost:8000/health
```

- Probar endpoint de prediccion:

```bash
curl -X POST http://localhost:8000/ai/predictions/process \
  -H "Content-Type: application/json" \
  -d "{\"tenantId\":\"tenant-1\",\"patientId\":\"patient-1\",\"encounterId\":\"encounter-1\",\"imageName\":\"image.png\",\"mimeType\":\"image/png\",\"imageBase64\":\"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8B9p87sQAAAABJRU5ErkJggg==\",\"modelType\":\"cnn\"}"
```

- Ejecutar pruebas dentro del contenedor:

```bash
docker compose run --rm ai-service python -m unittest tests.test_prediction_endpoint tests.test_prediction_contract tests.test_rate_limit_service tests.test_network_access_service
```

Notas de produccion del contenedor:

- Imagen Python slim con multi-stage build.
- Dependencias instaladas en virtualenv dedicado.
- Runtime como usuario no-root (`appuser`).
- Ejecucion FastAPI con `uvicorn` y workers configurables via `UVICORN_WORKERS`.
- Rate limiting distribuido configurable (`AI_RATE_LIMIT_BACKEND=redis`) usando `AI_REDIS_URL`.
- Endpoint `/metrics` protegible con API key (`AI_PROTECT_METRICS_ENDPOINT`) y/o restriccion por red interna (`AI_METRICS_INTERNAL_ONLY`, `AI_METRICS_ALLOWED_CIDRS`).
- `docker-compose.prod.yml` agrega sidecar `prometheus` para scraping interno de metricas sin exponer `/metrics` como endpoint publico operativo.
- `docker-compose.prod.yml` agrega restart policy, limites de recursos y rotacion basica de logs.

## Estructura principal

- `app/`: API e inferencia online
  - `api/routes/`: endpoints (`prediction`, `health`, `metrics`)
  - `api/schemas/`: contratos Pydantic de entrada/salida
  - `services/inference/`: orquestacion y runtime de inferencia
  - `services/observability/`: estado y render de metricas
  - `models/runtime/`: implementaciones de modelos en ejecucion
  - `core/`: configuracion centralizada
  - `utils/`: utilidades de pre/post-procesamiento
- `training/`: entrenamiento y evaluacion offline
- `tests/`: pruebas unitarias e integracion
- `models/`: artefactos versionados generados por entrenamiento
- `shared/`: logica reutilizable entre entrenamiento e inferencia (sin dependencias HTTP)

## API Contract

### Endpoint

- `POST /ai/predictions/process`

### Request (`PredictionRequest`)

```json
{
  "tenantId": "string (required)",
  "patientId": "string (required)",
  "encounterId": "string (required)",
  "imageName": "string (required)",
  "mimeType": "image/png | image/jpeg | image/jpg",
  "imageBase64": "string base64 (required)",
  "modelType": "cnn | unet"
}
```

### Response 200 (`PredictionResponse`)

```json
{
  "tenantId": "string",
  "patientId": "string",
  "encounterId": "string",
  "imageName": "string",
  "mimeType": "string",
  "modelType": "string",
  "result": {
    "finding": "string",
    "confidence": 0.0,
    "riskLevel": "low | medium | high",
    "recommendations": ["string"],
    "processingMs": 1,
    "modelVersion": "string",
    "segmentation": {}
  }
}
```

Headers relevantes:

- `x-trace-id`
- `x-model-version`

### Response 400 (`ErrorResponse`)

```json
{
  "detail": "mensaje claro de validacion",
  "errorType": "invalid_image_payload",
  "errors": []
}
```

`x-error-type` posibles:

- `invalid_image_payload`
- `mime_type_mismatch`
- `unsupported_image_format`
- `image_too_small`
- `image_size_limit_exceeded`

### Response 422

```json
{
  "detail": "Payload de solicitud invalido",
  "errorType": "request_validation_error",
  "errors": []
}
```

### Response 429

```json
{
  "detail": "Limite de solicitudes excedido. Intenta nuevamente en breve.",
  "errorType": "rate_limit_exceeded",
  "errors": []
}
```

Header:

- `x-error-type: rate_limit_exceeded`

## Convenciones de arquitectura

- La capa `training/` no debe importar modulos de `app/api`.
- La capa `services/inference/` debe permanecer reutilizable y no depender de contratos HTTP.
- Los contratos Pydantic de request/response viven en `app/api/schemas/` y solo los usa la capa API.
- La logica comun (features, transformaciones reutilizables) se ubica en `shared/`.

## Checklist de release tecnico

- [ ] Tests en verde: `python -m unittest discover -s tests -p "test_*.py"`
- [ ] Smoke de carga en verde: `python scripts/run_load_smoke.py`
- [ ] Alertas operativas en estado OK: `python scripts/check_metrics_alerts.py`
- [ ] Version de modelo activa validada (y rollback probado si aplica)
- [ ] Variables de entorno revisadas contra `.env.example`

## Modo 5: Hosting sin Docker (Python setup)

Este modo es para desplegar en hosting/VM con Python nativo, sin contenedores.

1. Preparar entorno e instalar dependencias:

```bash
cd ai-service
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

En Windows PowerShell:

```powershell
cd ai-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
```

2. Crear `.env` (recomendado desde `.env.prod.example`) y ajustar secretos reales:

```bash
cp .env.prod.example .env
```

3. Levantar servicio con `uvicorn`:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
```

Opcional (recomendado en hosting Linux): usar `gunicorn` con workers Uvicorn.

Instalar:

```bash
pip install gunicorn
```

Levantar:

```bash
gunicorn app.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --workers 2 --timeout 60
```

### Tuning rapido para `gunicorn` (referencia)

- Regla inicial de workers: `workers = (2 x CPU) + 1`
- Si hay poca RAM, empezar conservador (`workers=2`) y subir gradualmente.
- `timeout`: `60` para cargas normales; subir a `90-120` si hay inferencias pesadas.
- `keep-alive`: `5` a `15` segun latencia de red y balanceador.
- `max-requests`: reinicio preventivo de workers para estabilidad en procesos largos.

Ejemplo con tuning:

```bash
gunicorn app.main:app \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --workers 3 \
  --timeout 90 \
  --keep-alive 10 \
  --max-requests 1000 \
  --max-requests-jitter 100
```

4. Verificar servicio:

```bash
curl http://localhost:8000/health
```

### Ejecucion persistente recomendada (Linux con systemd)

Ejemplo de unidad `ai-service.service`:

```ini
[Unit]
Description=AI Service FastAPI
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/opt/ai-service
EnvironmentFile=/opt/ai-service/.env
ExecStart=/opt/ai-service/.venv/bin/gunicorn app.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --workers 2 --timeout 60
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Luego:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ai-service
sudo systemctl start ai-service
sudo systemctl status ai-service
```

Nota: para este modo en produccion se recomienda poner Nginx/Traefik delante del servicio para TLS, control de acceso y rate limiting en borde.

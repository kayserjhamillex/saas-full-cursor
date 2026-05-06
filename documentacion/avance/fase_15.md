# Avance Fase 15 - Observabilidad, Monitoreo y Trazabilidad

Fecha: 2026-04-21

## Herramientas implementadas

- `Prometheus` para scraping de metricas tecnicas por servicio.
- `Grafana` para visualizacion y configuracion de alertas.
- Endpoints estandar `/health` y `/metrics` en backend y servicios externos.
- Logging estructurado JSON por request en todos los servicios Node y `ai-service`.

## Metricas configuradas

- Uptime del proceso (`nodejs_process_uptime_seconds`).
- Memoria residente (`nodejs_process_resident_memory_bytes`).
- Heap usado (`nodejs_heap_used_bytes`).
- Metricas basicas de runtime en `ai-service`.
- Prometheus configurado para scrapear:
  - `api-gateway`, `auth-service`, `core-service`, `clinical-service`
  - `inventory-service`, `hr-service`, `financial-service`, `assets-service`
  - `scheduling-service`, `email-service`, `whatsapp-service`, `file-service`
  - `ai-service`

## Logging centralizado activo

- Se estandarizo formato de log JSON con:
  - `service`
  - `traceId`
  - `method`
  - `path`
  - `statusCode`
  - `durationMs`
  - `tenantId`
  - `timestamp`
- Todos los servicios emiten `x-trace-id` en la respuesta.

## Trazabilidad implementada

- Si llega `x-trace-id`, se reutiliza para correlacion.
- Si no llega, cada servicio genera un `traceId` nuevo.
- El `traceId` queda disponible en logs y en header de respuesta para reconstruir flujos.

## Alertas configuradas

- Base lista para alertas desde Grafana sobre:
  - servicios caidos (`up == 0`)
  - alta memoria
  - latencia elevada (a partir de logs o metricas extendidas)
- Queda habilitado el punto de extension para reglas por tenant y modulo.

## Pruebas ejecutadas

- Verificacion de endpoints `/health` en servicios backend y externos.
- Verificacion de endpoints `/metrics` en servicios backend y externos.
- Verificacion de targets de Prometheus en `docker/prometheus.yml`.
- Verificacion de emision de `x-trace-id` y logs estructurados.

## Problemas encontrados

- No existia endpoint uniforme de salud/metricas para microservicios Nest.
- No habia convencion unica de `traceId` entre servicios.
- No habia targets completos de scraping para Prometheus.

## Decisiones tecnicas

- Implementar observabilidad base sin dependencias extra para no bloquear entregas.
- Estandarizar instrumentacion en `main.ts` de cada servicio.
- Exponer `health` y `metrics` fuera del prefijo global para facilitar monitoreo.
- Mantener fase incremental: primero metrica tecnica base, luego metrica de negocio.

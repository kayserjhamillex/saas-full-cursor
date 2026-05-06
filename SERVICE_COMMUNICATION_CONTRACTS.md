# Service Communication Contracts

Este documento define el contrato de comunicacion entre servicios para mantener bajo acoplamiento y claridad operativa.

## 1) Contrato HTTP interno (synchronous API)

- El `api-gateway` es la unica puerta de entrada externa.
- El gateway reenvia solicitudes a servicios internos por contrato:
  - `baseUrl` (service endpoint)
  - `basePath` (prefijo funcional)
  - `tenantModule` (modulo a validar en `core-service`)
- Cada llamada interna debe incluir:
  - `Authorization: Bearer <jwt>`
  - `x-tenant-id: <tenantId>`
  - `x-internal-service-token` solo para rutas internas de validacion.

## 2) Contrato de errores HTTP

- Servicios deben devolver errores estructurados y consistentes.
- El gateway traduce errores aguas abajo a excepciones controladas:
  - `400` -> validacion/contrato invalido
  - `401` -> autenticacion/token invalido
  - `403` -> tenant/modulo no autorizado
  - timeout -> `408` con mensaje de upstream
  - errores de red/upstream -> `502/503` segun corresponda

Formato estandar de respuesta expuesta por gateway:

- Exito:
  - `success: true`
  - `service`, `traceId`, `timestamp`, `path`, `method`
  - `data` (payload de negocio)
- Error:
  - `success: false`
  - `service`, `traceId`, `timestamp`, `path`, `method`
  - `error.httpStatus`, `error.type`, `error.message`, `error.details`

## 3) Contrato de tenancy

- `tenantId` es obligatorio en rutas de dominio.
- `tenantId` en request debe coincidir con `tenantId` del JWT.
- La validacion de tenant y modulo se centraliza en `core-service`.

## 4) Contrato de eventos (cuando aplique)

Actualmente la comunicacion productiva principal es HTTP sincrona.
Para migraciones a eventos asincronos (RabbitMQ), usar envelope obligatorio:

```json
{
  "eventId": "uuid",
  "eventType": "domain.entity.action.v1",
  "occurredAt": "2026-04-23T10:00:00.000Z",
  "sourceService": "service-name",
  "tenantId": "tenant-id",
  "traceId": "trace-id",
  "payload": {}
}
```

Reglas del envelope:

- `eventType` versionado (`*.v1`, `*.v2`).
- `eventId` unico para deduplicacion/idempotencia.
- `tenantId` obligatorio para aislamiento multitenant.
- `traceId` obligatorio para trazabilidad extremo a extremo.

## 5) Checklist de PR para comunicacion entre servicios

- [ ] Endpoint interno definido por contrato (ruta, metodo, headers).
- [ ] Validacion de tenancy y autorizacion aplicada.
- [ ] Timeouts y manejo de error uniforme.
- [ ] Sin hardcode de secretos ni tokens.
- [ ] Si hay evento: envelope versionado y documentado.

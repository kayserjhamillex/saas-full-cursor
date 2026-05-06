# API Response, Naming and Error Convention

Estandar de contrato para APIs NestJS del proyecto.

## Objetivos

- Respuestas consistentes entre servicios.
- Naming uniforme y predecible.
- Manejo de errores explicito y trazable.

## 1) Envelope de error (obligatorio)

Toda respuesta de error HTTP debe usar:

```json
{
  "success": false,
  "service": "service-name",
  "traceId": "trace-id-or-null",
  "timestamp": "ISO-8601",
  "path": "/route",
  "method": "GET|POST|...",
  "error": {
    "httpStatus": 400,
    "type": "BadRequestException",
    "message": "detalle funcional",
    "details": {}
  }
}
```

## 2) Envelope de exito (gateway)

Para endpoints expuestos por gateway:

```json
{
  "success": true,
  "service": "api-gateway",
  "traceId": "trace-id-or-null",
  "timestamp": "ISO-8601",
  "path": "/gateway/...",
  "method": "GET|POST|...",
  "data": {}
}
```

Nota: en servicios internos, mantener compatibilidad funcional. Si se estandariza exito,
hacerlo por fases y coordinando contratos consumidores.

## 3) Naming estandar

- Booleanos: `is*`, `has*`, `success`.
- HTTP status en error: `httpStatus` (no `code` ambiguo).
- Trazabilidad: `traceId` obligatorio cuando exista.
- Campos de dominio en `camelCase` en respuestas API.

## 4) Manejo de errores

- Controllers sin try/catch ad hoc, delegar a excepciones + filtros globales.
- Mensajes de error orientados a contrato/negocio, no stack traces.
- En integraciones upstream, mapear errores externos a excepciones conocidas.

## 5) Checklist de PR

- [ ] Error envelope estandar aplicado.
- [ ] Naming coherente (`success`, `httpStatus`, `traceId`).
- [ ] Filtro global registrado en `main.ts`.
- [ ] Tests de error actualizados a contrato.

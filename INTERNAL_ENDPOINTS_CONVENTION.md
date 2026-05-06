# Convencion de Endpoints Internos (NestJS)

Este documento define el estandar para cualquier endpoint interno entre microservicios.

## 1) Ruta y alcance

- Todo endpoint interno debe vivir bajo prefijo `internal`.
- Ejemplo recomendado: `GET /<contexto>/internal/<recurso>/<accion>`.
- No exponer endpoints internos para consumo frontend/publico.

## 2) Seguridad obligatoria

- Todo endpoint interno debe protegerse con `InternalServiceTokenGuard`.
- Header obligatorio: `x-internal-service-token`.
- Validacion:
  - si falta configuracion interna (`INTERNAL_SERVICE_TOKEN`) -> `401 Token interno no configurado`,
  - si token recibido no coincide -> `401 Token interno invalido`.

## 3) Implementacion estandar

- Reusar guard ya definido por servicio en `src/guards/internal-service-token.guard.ts`.
- Aplicar en controlador con `@UseGuards(InternalServiceTokenGuard)`.
- Mantener controladores delgados: validacion de formato basico en controller, reglas de negocio en service.

## 4) Configuracion por entorno

- Definir `INTERNAL_SERVICE_TOKEN` en todos los servicios que:
  - expongan endpoints internos, o
  - consuman endpoints internos.
- Prohibido hardcodear tokens en codigo.
- Recomendado fail-fast en `main.ts` cuando el servicio dependa de contratos internos.

## 5) Contrato de llamada entre servicios

- El consumidor interno debe enviar:
  - `x-internal-service-token`,
  - `x-tenant-id` cuando aplique multi-tenant,
  - `authorization` cuando el flujo tambien requiera contexto de usuario.

## 6) Errores y observabilidad

- Mantener errores explicitos y consistentes (`401`, `400`, `403`, etc.).
- Incluir `x-trace-id` en el flujo para trazabilidad entre servicios.

## 7) Testing minimo obligatorio

- Cada endpoint interno nuevo debe tener al menos:
  - caso feliz con token interno valido,
  - caso sin token interno (`401`),
  - caso con token incorrecto (`401`).

## 8) Checklist de PR (internals)

- [ ] Ruta bajo `internal`.
- [ ] `@UseGuards(InternalServiceTokenGuard)` aplicado.
- [ ] `INTERNAL_SERVICE_TOKEN` documentado en compose/env.
- [ ] Tests de seguridad interna agregados y en verde.
- [ ] Sin uso de secretos hardcodeados.

# AVANCE - FASE 2 SAAS CORE

## Fecha de implementacion

2026-04-21

## Servicios implementados

- `core-service`
- `api-gateway` (integracion de validacion SaaS)

## Funcionalidades completadas

- gestion de tenants en `core-service`:
  - creacion de tenant (`POST /core/tenants`)
  - consulta por id (`GET /core/tenants/:tenantId`)
- gestion de suscripciones:
  - creacion de suscripcion (`POST /core/subscriptions`)
  - expiracion de suscripciones vencidas (`PATCH /core/subscriptions/expire-overdue`)
- registro de pagos:
  - registro de pago y reactivacion de tenant/suscripcion (`POST /core/payments`)
- control de modulos:
  - activacion o desactivacion por tenant (`PATCH /core/modules/status`)
  - validacion de modulo habilitado en flujo SaaS
- validacion SaaS centralizada:
  - `GET /core/tenants/internal/:tenantId/validate?module=<moduleName>`
  - verifica tenant activo, suscripcion vigente y modulo habilitado

## Integracion con API Gateway validada

- endpoint protegido de gateway mantiene validacion JWT y tenant:
  - `GET /gateway/core/tenants/:tenantId/status?module=<moduleName>`
- gateway delega validacion de negocio SaaS a `core-service` sin duplicar logica.

## Integracion con base de datos validada

- se implemento acceso a datos con `pg` y consultas parametrizadas para:
  - `tenants`
  - `subscriptions`
  - `payments`
  - `tenant_modules`

## Reglas de desarrollo aplicadas

- arquitectura por capas aplicada en `core-service`:
  - `controllers`
  - `services`
  - `repositories`
  - `domain`
- sin logica de negocio en controladores.
- validacion multi-tenant y estado SaaS en cada request protegido.
- integracion entre servicios por HTTP explicito (`api-gateway -> core-service`).

## Pruebas ejecutadas

- compilacion TypeScript en verde:
  - `apps/core-service` (`pnpm build`)
  - `apps/api-gateway` (`pnpm build`)
- revision de diagnosticos de linter:
  - sin errores en archivos modificados.

## Problemas encontrados

- ninguno bloqueante en esta iteracion.

## Decisiones tecnicas tomadas

- centralizar toda validacion de tenant/suscripcion/modulos en `core-service`.
- mantener `api-gateway` como capa de autenticacion/enrutamiento y no de negocio.
- usar mapeo inicial de modulos por plan (`basic`, `pro`, `enterprise`) para permitir evolucion incremental.

# AVANCE — FASE 1 ARQUITECTURA BASE

## Fecha de implementacion

2026-04-21

## Servicios implementados

- `api-gateway`
- `auth-service`
- `core-service`

## Funcionalidades completadas

- autenticacion JWT en `auth-service` (`POST /auth/login`)
- validacion tenant y suscripcion en `core-service` (`GET /core/internal/tenants/:tenantId/validate`)
- routing base y control de acceso en `api-gateway`

## Integracion con base de datos validada

- se configuro PostgreSQL en Docker con:
  - `POSTGRES_DB=saasodontologico`
  - `POSTGRES_PASSWORD=123`
- variables de entorno de desarrollo actualizadas:
  - `DB_NAME=saasodontologico`
  - `DB_PASSWORD=123`

## Reglas de desarrollo aplicadas

- arquitectura por capas inicial (controller/service + consultas a datos en service)
- JWT obligatorio para endpoint protegido expuesto por gateway
- tenant obligatorio via header `x-tenant-id` y coherencia con token JWT

## Pruebas ejecutadas

- compilacion TypeScript de:
  - `apps/auth-service`
  - `apps/core-service`
  - `apps/api-gateway`

## Problemas encontrados

- no se incluyeron migraciones SQL en esta fase; se asume existencia de tablas `users`, `tenants` y `subscriptions` segun la documentacion de base de datos.

## Decisiones tecnicas tomadas

- mantener validacion de tenant centralizada en `core-service`.
- mantener `api-gateway` como punto unico para login y endpoints protegidos.
- usar secreto JWT de desarrollo en `.env` y marcarlo para reemplazo previo a produccion.

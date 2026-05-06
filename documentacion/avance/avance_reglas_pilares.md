# AVANCE — CREACIÓN DE PILARES Y REGLAS

## Fecha

2026-04-21

## Trabajo realizado

Se ejecutó la definición inicial de reglas técnicas del proyecto según `documentacion/instrucciones/realizar_reglas`, incluyendo revisión previa de la estructura real del repositorio para contextualizar las reglas.

### 1) Contexto levantado del proyecto

Se verificó la existencia y estado de:

- `apps`: microservicios (`api-gateway`, `auth-service`, `core-service`, `clinical-service`, `inventory-service`, `scheduling-service`, `financial-service`, `hr-service`).
- `frontend`: `react-app` y `angular-app`.
- `ai-service`: estructura base con `app/main.py`.
- `docker`: `docker-compose.yml` con PostgreSQL 15.
- `documentacion`: carpetas `instrucciones`, `reglas`, `avance`, entre otras.

También se validó stack actual de referencia:

- NestJS 11 + TypeScript + Jest + ESLint (backend).
- React 19 + Vite + Zustand (frontend React).
- Angular (frontend Angular).
- FastAPI como base del servicio IA (estructura inicial).

### 2) Entregable generado

Se creó el documento:

- `documentacion/reglas/pilares_desarrollo.md`

Contenido principal incorporado:

- Alcance y objetivo de reglas transversales.
- Reglas de arquitectura por capa para backend, frontend e IA.
- Reglas de seguridad obligatorias (JWT, bcrypt, RBAC, sanitización y protecciones).
- Reglas de validación (DTOs, validación en frontend/IA, validación tenant, integridad de datos).
- Reglas de calidad y testing (TDD/BDD/DDD según tipo de módulo).
- Reglas de integración y eventos (`entity_created`, `entity_updated`, `transaction_completed`).
- Criterios de cumplimiento para cierre de tareas técnicas.

## Resultado

Quedó establecida una base formal de gobierno técnico en `documentacion/reglas`, alineada con la estructura y tecnologías actualmente presentes en el repositorio.

## Siguiente paso sugerido

Crear una matriz de checklist por servicio (`apps/*`, `frontend/*`, `ai-service`) para auditar el cumplimiento de estas reglas en cada sprint.

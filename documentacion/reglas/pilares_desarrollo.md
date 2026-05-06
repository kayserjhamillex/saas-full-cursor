# PILARES TÉCNICOS Y REGLAS OBLIGATORIAS

## 1) Alcance y objetivo

Este documento define las reglas obligatorias para el desarrollo del SaaS odontológico, aplicables a:

- Backend microservicios NestJS en `apps/*`
- Frontend React en `frontend/react-app`
- Frontend Angular en `frontend/angular-app`
- Servicio de IA en `ai-service`

Objetivo: mantener consistencia arquitectónica, seguridad, mantenibilidad y escalabilidad desde el inicio del proyecto.

## 2) Contexto técnico del repositorio

Stack identificado en el proyecto:

- `pnpm` en raíz del repositorio.
- Backend: NestJS 11 + TypeScript + Jest + ESLint + PostgreSQL.
- Frontend React: Vite + React 19 + React Router + Zustand + ESLint.
- Frontend Angular: Angular CLI con SCSS y pruebas unitarias.
- IA: `ai-service/app` con FastAPI (estructura inicial).
- Infraestructura local: PostgreSQL 15 en `docker/docker-compose.yml`.

## 3) Reglas de arquitectura (obligatorias)

### 3.1 Backend `apps/*`

1. Cada microservicio debe respetar capas:
   - `controller`: solo entrada/salida HTTP.
   - `service`: lógica de negocio.
   - `repository`: acceso a datos.
   - `domain`: entidades, reglas y contratos de dominio.
2. Prohibido incluir lógica de negocio dentro de controladores.
3. Prohibido acoplar servicios entre sí de forma directa a nivel de base de datos.
4. Toda integración entre microservicios pasa por API Gateway o contratos HTTP explícitos.

### 3.2 Frontend `frontend/*`

1. Separación obligatoria entre UI, estado y acceso a API.
2. Prohibido consumir endpoints directamente desde componentes si existe capa de servicios.
3. Rutas y navegación deben estar centralizadas (`routes` o equivalente de framework).
4. Mantener componentes pequeños y orientados a presentación o contenedor.

### 3.3 IA `ai-service`

1. Mantener separación por responsabilidades:
   - `routes`: endpoints.
   - `services`: orquestación y lógica.
   - `models`: carga/uso de modelos IA.
2. No mezclar lógica de negocio clínica dentro de controladores de FastAPI.
3. Toda salida de IA expuesta a otros servicios debe pasar por validación de esquema.

## 4) Reglas de seguridad (obligatorias)

1. JWT obligatorio para endpoints privados.
2. Hash de contraseñas obligatorio con `bcrypt`.
3. Control por roles (RBAC) para operaciones sensibles.
4. Sanitización de inputs en backend, frontend e IA.
5. Protección contra SQL Injection, XSS y CSRF en capas correspondientes.
6. Variables sensibles solo en `.env`, nunca hardcodeadas.

## 5) Reglas de validación y datos

1. Backend: DTOs obligatorios para entradas de API.
2. Frontend: validación de formularios antes de invocar servicios.
3. IA: validación de payload de entrada y salida.
4. Multi-tenant: toda operación de negocio debe validar el `tenant`.
5. Integridad de datos obligatoria en PostgreSQL (constraints, claves y consistencia).

## 6) Reglas de calidad y pruebas

1. En backend, aplicar TDD en lógica crítica de servicios.
2. Toda nueva funcionalidad debe incluir:
   - prueba unitaria;
   - prueba de integración cuando aplique.
3. En frontend, cubrir flujos de usuario prioritarios con enfoque BDD.
4. Dominios de alta complejidad (clínico, inventario, patrimonio) deben modelarse con enfoque DDD.
5. Antes de merge:
   - `lint` sin errores;
   - tests relevantes en verde.

## 7) Reglas de eventos e integración

1. Eventos permitidos como estándar inicial:
   - `entity_created`
   - `entity_updated`
   - `transaction_completed`
2. Los eventos deben ser desacoplados, versionados y con payload mínimo necesario.
3. Usos permitidos: auditoría, sincronización entre servicios y notificaciones.

## 8) Reglas operativas de desarrollo

1. Consultar este documento antes de implementar cualquier módulo.
2. Toda feature debe declarar claramente:
   - servicio/módulo afectado;
   - capas impactadas;
   - validaciones de seguridad.
3. Prohibida duplicación de lógica entre microservicios y frontends.
4. Cualquier excepción a estas reglas debe documentarse con justificación técnica.

## 9) Criterio de cumplimiento

Una tarea se considera "cumplida" solo si:

- respeta arquitectura por capas;
- incluye validaciones y seguridad obligatoria;
- tiene cobertura de pruebas mínima acordada;
- no introduce acoplamiento indebido ni duplicación.

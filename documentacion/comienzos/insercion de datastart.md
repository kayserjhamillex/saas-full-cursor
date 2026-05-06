# Inserción datastart

## Antecedente

No existía en el repositorio un script versionado de **creación de esquema + datos iniciales** alineado con los microservicios. Esta entrega lo incorpora por primera vez (abril de 2026).

## Qué se añadió

| Artefacto | Descripción |
|-----------|-------------|
| `database/datastart.sql` | Transacción única: `CREATE TABLE IF NOT EXISTS` para las tablas usadas por los repositorios Nest (`pg`) y `INSERT` idempotentes de demostración. |

El diseño conceptual sigue documentado en `documentacion/database/basedetadosenterprice.md`; el SQL refleja columnas y nombres de tablas tal como aparecen en el código de `apps/*`.

## Requisitos

- PostgreSQL 15 (la imagen del proyecto es `postgres:15`).
- Base de datos `saasodontologico` creada (el contenedor definido en `docker/docker-compose.yml` la crea con `POSTGRES_DB`).

Variables habituales en servicios (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) coinciden con los valores por defecto del compose si no se sobreescriben.

## Cómo aplicar el script

1. Levantar la base (ejemplo con Docker):

   ```powershell
   docker compose -f docker/docker-compose.yml up -d postgres
   ```

2. Cargar el SQL (PowerShell):

   ```powershell
   Get-Content -Raw .\database\datastart.sql | docker exec -i saas_postgres psql -U postgres -d saasodontologico -v ON_ERROR_STOP=1
   ```

   En entornos Unix:

   ```bash
   docker exec -i saas_postgres psql -U postgres -d saasodontologico -v ON_ERROR_STOP=1 < database/datastart.sql
   ```

El script es **idempotente**: repetir la ejecución no duplica filas semilla (usa `ON CONFLICT` donde aplica).

## Credenciales y tenant de demostración

| Campo | Valor |
|-------|--------|
| **tenantId** | `a0000001-0001-4001-8001-000000000001` |
| **email** | `admin@datastart.local` |
| **contraseña** | `Admin123!` (solo entornos de desarrollo) |

El hash almacenado en `users.password` es **bcrypt** (coste 10), generado con la dependencia `bcrypt` del `auth-service`.

## Datos semilla incluidos

- Tenant activo **Clínica Demo Datastart**.
- Rol `admin` y usuario enlazado para login en `auth-service` (requiere `email`, `password`, `tenantId`).
- Suscripción activa anual y un pago de ejemplo.
- Módulos de tenant: `core`, `clinical`, `inventory`, `financial`, `hr`.
- Paciente de ejemplo con historia clínica y un encuentro clínico.
- Categoría de inventario, producto, almacén y fila de **stock**.
- Empleado de RRHH, cuenta financiera y categoría de activos fijos.

Los UUID fijos permiten enlazar la documentación con pruebas manuales o automatizadas sin depender de `RETURNING` aleatorios.

## Notas operativas

- Si ya tenías tablas creadas manualmente con tipos distintos, revisa conflictos antes de ejecutar el script en esa instancia.
- Para un entorno limpio, puedes recrear el volumen de Postgres (implica **pérdida de datos** del contenedor).

## Historial de este documento

| Fecha | Cambio |
|-------|--------|
| 2026-04-21 | Creación: script `database/datastart.sql` y esta guía. |

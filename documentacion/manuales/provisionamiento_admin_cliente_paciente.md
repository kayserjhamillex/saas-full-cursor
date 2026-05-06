# Provisionamiento: Admin SaaS, Cliente SaaS y Paciente

## 1. Objetivo

Crear en entorno local:

- un **administrador SaaS** (usuario interno de la clinica/tenant),
- un **cliente SaaS** (usuario adicional del mismo tenant),
- un **paciente** asociado al tenant.

> Nota: en el estado actual del proyecto no existe endpoint de registro de usuarios en `auth-service`; por eso los usuarios se crean directamente en PostgreSQL.

## 2. Prerrequisitos

- Docker con PostgreSQL levantado.
- `core-service`, `auth-service`, `api-gateway` y `clinical-service` activos.
- Variables por defecto del proyecto (DB `saasodontologico`, usuario `postgres`, password `123`).

## 3. Paso A - Crear tenant (cliente SaaS)

Desde PowerShell:

```powershell
curl -X POST http://localhost:3002/core/tenants `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Clinica Demo SaaS\"}"
```

Guarda el valor retornado como `TENANT_ID`.

## 4. Paso B - Crear suscripcion activa

```powershell
curl -X POST http://localhost:3002/core/subscriptions `
  -H "Content-Type: application/json" `
  -d "{\"tenantId\":\"TENANT_ID\",\"plan\":\"pro\",\"durationDays\":30}"
```

## 5. Paso C - Crear usuarios (admin SaaS y cliente SaaS)

Ejecuta este SQL en PostgreSQL (reemplaza `TENANT_ID`):

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico <<'SQL'
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO users (tenant_id, email, password, role_id)
VALUES
  ('TENANT_ID', 'admin@demo.com', crypt('Admin123*', gen_salt('bf')), NULL),
  ('TENANT_ID', 'cliente@demo.com', crypt('Cliente123*', gen_salt('bf')), NULL)
ON CONFLICT (email) DO NOTHING;
SQL
```

Credenciales creadas:

- Admin SaaS: `admin@demo.com` / `Admin123*`
- Cliente SaaS: `cliente@demo.com` / `Cliente123*`

## 6. Paso D - Obtener token del admin SaaS

```powershell
curl -X POST http://localhost:3000/gateway/auth/login `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"admin@demo.com\",\"password\":\"Admin123*\",\"tenantId\":\"TENANT_ID\"}"
```

Guarda `accessToken` como `ACCESS_TOKEN`.

## 7. Paso E - Crear paciente para el cliente SaaS

```powershell
curl -X POST http://localhost:3000/gateway/clinical/patients `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer ACCESS_TOKEN" `
  -H "x-tenant-id: TENANT_ID" `
  -d "{\"tenantId\":\"TENANT_ID\",\"name\":\"Paciente Demo\",\"document\":\"DOC-0001\",\"birthDate\":\"1992-04-10\"}"
```

## 8. Validacion rapida

### 8.1 Login del cliente SaaS

```powershell
curl -X POST http://localhost:3000/gateway/auth/login `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"cliente@demo.com\",\"password\":\"Cliente123*\",\"tenantId\":\"TENANT_ID\"}"
```

### 8.2 Verificar paciente en DB

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico -c "SELECT id, tenant_id, name, document, birth_date FROM patients WHERE tenant_id = 'TENANT_ID' ORDER BY created_at DESC LIMIT 5;"
```

## 9. Observaciones

- Si falla el `INSERT INTO users` por estructura distinta de tabla, consulta columnas reales con:

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico -c "\d users"
```

- Si recibes `Tenant invalido` o `Suscripcion inactiva`, repite pasos de tenant y suscripcion.
- Si recibes `Unauthorized`, valida `tenantId`, email, password y encabezado `x-tenant-id`.

# Manual de Usuario - Pruebas del sistema con Docker

## 1. Objetivo

Este manual explica como levantar el entorno base y probar el sistema SaaS odontologico usando Docker para la base de datos PostgreSQL.

> Nota: actualmente el `docker-compose.yml` del proyecto levanta PostgreSQL.  
> Los microservicios (`auth-service`, `core-service`, `api-gateway`, `clinical-service`) se ejecutan localmente con `pnpm`.

## 2. Prerrequisitos

- Docker Desktop instalado y ejecutandose.
- Node.js 20+.
- pnpm instalado globalmente.
- Puerto `5432` libre para PostgreSQL.
- Puertos `3000`, `3001`, `3002`, `3003` libres para los servicios.
- Puerto `3004` libre para `inventory-service`.
- Puerto `3005` libre para `hr-service`.
- Puerto `3006` libre para `financial-service`.
- Puerto `3007` libre para `assets-service`.
- Puerto `3008` libre para `scheduling-service`.
- Puerto `8000` libre para `ai-service`.

## 3. Configuracion de entorno

En la raiz del proyecto existe `.env` con los valores base:

- `DB_HOST=localhost`
- `DB_PORT=5432`
- `DB_USER=postgres`
- `DB_PASSWORD=123`
- `DB_NAME=saasodontologico`
- `JWT_SECRET=dev_jwt_secret_change_before_prod`
- `AUTH_SERVICE_URL=http://localhost:3001`
- `CORE_SERVICE_URL=http://localhost:3002`
- `CLINICAL_SERVICE_URL=http://localhost:3003`
- `INVENTORY_SERVICE_URL=http://localhost:3004`
- `HR_SERVICE_URL=http://localhost:3005`
- `FINANCIAL_SERVICE_URL=http://localhost:3006`
- `ASSETS_SERVICE_URL=http://localhost:3007`
- `SCHEDULING_SERVICE_URL=http://localhost:3008`
- `AI_SERVICE_URL=http://localhost:8000`

Si cambias puertos/credenciales en Docker, actualiza tambien este archivo.

## 3.1 Guia rapida de ejecucion del proyecto (paso a paso)

Esta seccion resume el orden recomendado para levantar todo el sistema y verificar que esta funcionando.

### Paso 1 - Levantar base de datos (Docker)

Desde la raiz del proyecto:

```bash
docker compose -f docker/docker-compose.yml up -d
docker ps
```

Debes ver el contenedor `saas_postgres` en estado `Up`.

### Paso 2 - Instalar dependencias de servicios (primera vez)

Ejecuta una vez por servicio:

```bash
cd apps/auth-service && pnpm install
cd ../core-service && pnpm install
cd ../api-gateway && pnpm install
cd ../clinical-service && pnpm install
cd ../inventory-service && pnpm install
cd ../hr-service && pnpm install
```

### Paso 3 - Levantar backend en terminales separadas

Abre terminales distintas, siempre desde la raiz `D:\proyectos\saasodontologico`:

**Terminal 1 - auth-service**

```bash
cd apps/auth-service
pnpm start:dev
```

**Terminal 2 - core-service**

```bash
cd apps/core-service
pnpm start:dev
```

**Terminal 3 - api-gateway**

```bash
cd apps/api-gateway
pnpm start:dev
```

**Terminal 4 - clinical-service**

```bash
cd apps/clinical-service
pnpm start:dev
```

**Terminal 5 - inventory-service**

```bash
cd apps/inventory-service
pnpm start:dev
```

**Terminal 6 - ai-service (FastAPI)**

```bash
cd ai-service
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 7 - hr-service**

```bash
cd apps/hr-service
pnpm start:dev
```

**Terminal 8 - financial-service**

```bash
cd apps/financial-service
pnpm start:dev
```

**Terminal 9 - assets-service**

```bash
cd apps/assets-service
pnpm start:dev
```

**Terminal 10 - scheduling-service**

```bash
cd apps/scheduling-service
pnpm start:dev
```

### Paso 4 - Verificar puertos backend/gateway

Validar que quedaron escuchando:

- `api-gateway` en `http://localhost:3000`
- `auth-service` en `http://localhost:3001`
- `core-service` en `http://localhost:3002`
- `clinical-service` en `http://localhost:3003`
- `inventory-service` en `http://localhost:3004`
- `hr-service` en `http://localhost:3005`
- `financial-service` en `http://localhost:3006`
- `assets-service` en `http://localhost:3007`
- `scheduling-service` en `http://localhost:3008`
- `ai-service` en `http://localhost:8000`

Si algun servicio no inicia, revisar logs de esa terminal antes de continuar.

### Paso 5 - Levantar frontends

**Terminal 11 - Demo app (captacion)**

```bash
cd frontend/demo-app
pnpm install
pnpm dev
```

**Terminal 12 - React (clinico)**

```bash
cd frontend/react-app
pnpm install
pnpm dev
```

**Terminal 13 - Angular (panel SaaS)**

```bash
cd frontend/angular-app
npm install
npm start
```

### Paso 6 - Verificar frontends en navegador

- Demo app: `http://localhost:4173`
- React: URL que imprime Vite (normalmente `http://localhost:5173`)
- Angular: `http://localhost:4200`

### Paso 7 - Orden de apagado recomendado

1. Detener frontends (`Ctrl + C` en terminales 11, 12 y 13).
2. Detener microservicios/backend (`Ctrl + C` en terminales 1 a 10).
3. Apagar Docker:

```bash
docker compose -f docker/docker-compose.yml down
```

## 4. Levantar PostgreSQL con Docker

Desde la raiz del repositorio:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Verifica estado:

```bash
docker ps
```

Debe aparecer el contenedor `saas_postgres`.

## 5. Crear tablas minimas para Fase 2

Si la base esta vacia, ejecuta estas tablas minimas:

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico <<'SQL'
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  plan VARCHAR(50) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  amount NUMERIC(12,2) NOT NULL,
  payment_date TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS tenant_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  module_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (tenant_id, module_name)
);
SQL
```

## 6. Ejecutar microservicios

En 6 terminales separadas:

### Terminal 1 - auth-service

```bash
cd apps/auth-service
pnpm install
pnpm start:dev
```

### Terminal 2 - core-service

```bash
cd apps/core-service
pnpm install
pnpm start:dev
```

### Terminal 3 - api-gateway

```bash
cd apps/api-gateway
pnpm install
pnpm start:dev
```

### Terminal 4 - clinical-service

```bash
cd apps/clinical-service
pnpm install
pnpm start:dev
```

### Terminal 5 - inventory-service

```bash
cd apps/inventory-service
pnpm install
pnpm start:dev
```

### Terminal 6 - ai-service (FastAPI)

```bash
cd ai-service
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

## 7. Crear tablas minimas para Fase 3 (clinico)

Ejecuta este bloque adicional para habilitar el dominio clinico:

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico <<'SQL'
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(150) NOT NULL,
  document VARCHAR(80) NOT NULL,
  birth_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS clinical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL UNIQUE REFERENCES patients(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS clinical_encounters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID NOT NULL REFERENCES clinical_records(id),
  encounter_date TIMESTAMP NOT NULL,
  notes TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID NOT NULL REFERENCES clinical_encounters(id),
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID NOT NULL REFERENCES clinical_encounters(id),
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID NOT NULL REFERENCES clinical_encounters(id),
  medication VARCHAR(150) NOT NULL,
  dosage VARCHAR(120) NOT NULL,
  instructions TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS odontograms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL UNIQUE REFERENCES patients(id),
  chart_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clinical_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  event_type VARCHAR(80) NOT NULL,
  reference_id UUID NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID NOT NULL REFERENCES clinical_encounters(id),
  notes TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
SQL
```

## 8. Flujo de prueba funcional (Fase 2)

## 8.1 Crear tenant

```bash
curl -X POST http://localhost:3002/core/tenants ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Clinica Demo\"}"
```

Guarda el `id` retornado como `TENANT_ID`.

## 8.2 Crear suscripcion del tenant

```bash
curl -X POST http://localhost:3002/core/subscriptions ^
  -H "Content-Type: application/json" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"plan\":\"pro\",\"durationDays\":30}"
```

## 8.3 Registrar pago

```bash
curl -X POST http://localhost:3002/core/payments ^
  -H "Content-Type: application/json" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"amount\":250,\"status\":\"paid\",\"extensionDays\":30}"
```

## 8.4 Validar tenant y modulo directamente en core-service

```bash
curl "http://localhost:3002/core/tenants/internal/TENANT_ID/validate?module=clinical"
```

Respuesta esperada: `valid: true`.

## 8.5 Validar tenant desde gateway (requiere JWT)

1. Obtener token con login:

```bash
curl -X POST http://localhost:3000/gateway/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@demo.com\",\"password\":\"123456\",\"tenantId\":\"TENANT_ID\"}"
```

2. Usar el token (`ACCESS_TOKEN`) para validar:

```bash
curl "http://localhost:3000/gateway/core/tenants/TENANT_ID/status?module=clinical" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID"
```

## 9. Flujo de prueba funcional (Fase 3 clinico)

> Requiere haber creado tenant, suscripcion y token de las secciones anteriores.

## 9.1 Registrar paciente (crea historia clinica automaticamente)

```bash
curl -X POST http://localhost:3000/gateway/clinical/patients ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"name\":\"Maria Perez\",\"document\":\"12345678\",\"birthDate\":\"1990-05-10\"}"
```

Guarda el `id` de `patient` como `PATIENT_ID`.

## 9.2 Registrar consulta clinica

```bash
curl -X POST http://localhost:3000/gateway/clinical/records/encounters ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"patientId\":\"PATIENT_ID\",\"encounterDate\":\"2026-04-21T10:00:00Z\",\"notes\":\"Dolor en molar superior derecho\"}"
```

Guarda el `id` de `encounter` como `ENCOUNTER_ID`.

## 9.3 Registrar diagnostico

```bash
curl -X POST http://localhost:3000/gateway/clinical/records/diagnoses ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"patientId\":\"PATIENT_ID\",\"encounterId\":\"ENCOUNTER_ID\",\"description\":\"Caries oclusal en pieza 16\"}"
```

## 9.4 Registrar tratamiento

```bash
curl -X POST http://localhost:3000/gateway/clinical/records/treatments ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"patientId\":\"PATIENT_ID\",\"encounterId\":\"ENCOUNTER_ID\",\"description\":\"Obturacion con resina en pieza 16\"}"
```

## 9.5 Crear receta

```bash
curl -X POST http://localhost:3000/gateway/clinical/records/prescriptions ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"patientId\":\"PATIENT_ID\",\"encounterId\":\"ENCOUNTER_ID\",\"medication\":\"Ibuprofeno 400mg\",\"dosage\":\"1 tableta cada 8 horas\",\"instructions\":\"Por 3 dias despues de alimentos\"}"
```

## 9.6 Registrar evolucion

```bash
curl -X POST http://localhost:3000/gateway/clinical/records/evolutions ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"patientId\":\"PATIENT_ID\",\"encounterId\":\"ENCOUNTER_ID\",\"notes\":\"Paciente refiere disminucion del dolor a las 48h\"}"
```

## 9.7 Actualizar odontograma

```bash
curl -X POST http://localhost:3000/gateway/clinical/odontograms ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"patientId\":\"PATIENT_ID\",\"chartData\":{\"16\":{\"status\":\"restaurado\",\"faces\":[\"oclusal\"]},\"17\":{\"status\":\"sano\"}}}"
```

## 9.8 Consultar cronologia clinica

```bash
curl "http://localhost:3000/gateway/clinical/records/timeline/PATIENT_ID?tenantId=TENANT_ID" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID"
```

Debes ver eventos como:
- `patient_created`
- `clinical_record_created`
- `encounter_created`
- `diagnosis_registered`
- `treatment_assigned`
- `prescription_created`
- `evolution_registered`
- `odontogram_updated`

## 10. Pruebas de bloqueo SaaS

### 10.1 Expirar suscripciones vencidas

```bash
curl -X PATCH http://localhost:3002/core/subscriptions/expire-overdue
```

### 10.2 Desactivar modulo manualmente

```bash
curl -X PATCH http://localhost:3002/core/modules/status ^
  -H "Content-Type: application/json" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"moduleName\":\"clinical\",\"isActive\":false}"
```

Si luego validas con `module=clinical`, el acceso debe ser rechazado.

## 11. Crear tablas minimas para Fase 4 (inventario ERP)

Ejecuta este bloque para habilitar inventario, almacenes, movimientos y kardex:

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico <<'SQL'
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL,
  UNIQUE (tenant_id, name)
);

CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id),
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  category_id UUID NOT NULL REFERENCES categories(id),
  subcategory_id UUID NULL REFERENCES subcategories(id),
  sku VARCHAR(80) NOT NULL,
  name VARCHAR(150) NOT NULL,
  unit VARCHAR(40) NOT NULL DEFAULT 'unidad',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL,
  UNIQUE (tenant_id, sku)
);

CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL,
  UNIQUE (tenant_id, name)
);

CREATE TABLE IF NOT EXISTS sub_warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  name VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_warehouse_id UUID NOT NULL REFERENCES sub_warehouses(id),
  code VARCHAR(80) NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL,
  UNIQUE (sub_warehouse_id, code)
);

CREATE TABLE IF NOT EXISTS stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  product_id UUID NOT NULL REFERENCES products(id),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  quantity NUMERIC(14,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stock_minimum (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  product_id UUID NOT NULL REFERENCES products(id),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  minimum_quantity NUMERIC(14,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  product_id UUID NOT NULL REFERENCES products(id),
  from_warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  to_warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  quantity NUMERIC(14,2) NOT NULL,
  status VARCHAR(30) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  product_id UUID NOT NULL REFERENCES products(id),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  movement_type VARCHAR(30) NOT NULL,
  quantity NUMERIC(14,2) NOT NULL,
  reference VARCHAR(120) NULL,
  notes TEXT NULL,
  transfer_id UUID NULL REFERENCES transfers(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kardex_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  product_id UUID NOT NULL REFERENCES products(id),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  movement_id UUID NOT NULL REFERENCES inventory_movements(id),
  movement_type VARCHAR(30) NOT NULL,
  quantity_in NUMERIC(14,2) NOT NULL DEFAULT 0,
  quantity_out NUMERIC(14,2) NOT NULL DEFAULT 0,
  balance NUMERIC(14,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
SQL
```

## 12. Flujo de prueba funcional (Fase 4 inventario)

> Requiere tenant activo, modulo `inventory` activo y token JWT valido.

### 12.1 Crear categoria base

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico <<'SQL'
INSERT INTO categories (tenant_id, name)
VALUES ('TENANT_ID', 'Insumos')
ON CONFLICT (tenant_id, name) DO NOTHING;
SQL
```

### 12.2 Obtener `CATEGORY_ID`

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico -c "SELECT id, name FROM categories WHERE tenant_id = 'TENANT_ID';"
```

### 12.3 Registrar producto

```bash
curl -X POST http://localhost:3000/gateway/inventory/products ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"categoryId\":\"CATEGORY_ID\",\"sku\":\"GUANTE-NITRILO-M\",\"name\":\"Guante nitrilo talla M\",\"unit\":\"caja\"}"
```

Guarda `product.id` como `PRODUCT_ID`.

### 12.4 Crear almacen

```bash
curl -X POST http://localhost:3000/gateway/inventory/warehouses ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"name\":\"Almacen principal\"}"
```

Guarda `id` como `WAREHOUSE_A`.

### 12.5 Crear segundo almacen

```bash
curl -X POST http://localhost:3000/gateway/inventory/warehouses ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"name\":\"Almacen clinico\"}"
```

Guarda `id` como `WAREHOUSE_B`.

### 12.6 Registrar entrada de stock

```bash
curl -X POST http://localhost:3000/gateway/inventory/stock/entries ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"productId\":\"PRODUCT_ID\",\"warehouseId\":\"WAREHOUSE_A\",\"quantity\":100,\"reference\":\"COMPRA-001\",\"notes\":\"Ingreso inicial\"}"
```

### 12.7 Registrar salida de stock

```bash
curl -X POST http://localhost:3000/gateway/inventory/stock/exits ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"productId\":\"PRODUCT_ID\",\"warehouseId\":\"WAREHOUSE_A\",\"quantity\":15,\"reference\":\"CONSUMO-ODONTO-01\",\"notes\":\"Consumo de turno\"}"
```

### 12.8 Transferir stock entre almacenes

```bash
curl -X POST http://localhost:3000/gateway/inventory/stock/transfers ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"productId\":\"PRODUCT_ID\",\"fromWarehouseId\":\"WAREHOUSE_A\",\"toWarehouseId\":\"WAREHOUSE_B\",\"quantity\":20,\"reference\":\"TR-001\",\"notes\":\"Reposicion area clinica\"}"
```

### 12.9 Consultar stock actual

```bash
curl "http://localhost:3000/gateway/inventory/stock/PRODUCT_ID?tenantId=TENANT_ID&warehouseId=WAREHOUSE_A" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID"
```

### 12.10 Consultar kardex

```bash
curl "http://localhost:3000/gateway/inventory/kardex/PRODUCT_ID?tenantId=TENANT_ID&warehouseId=WAREHOUSE_A" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID"
```

Debes ver movimientos `entry`, `exit`, `transfer_out` con saldo actualizado.

## 13. Comandos utiles Docker

- Ver logs de PostgreSQL:

```bash
docker logs -f saas_postgres
```

- Entrar a consola SQL:

```bash
docker exec -it saas_postgres psql -U postgres -d saasodontologico
```

- Apagar entorno Docker:

```bash
docker compose -f docker/docker-compose.yml down
```

## 14. Solucion de problemas

- `connection refused` a DB:
  - revisar `docker ps`
  - confirmar que puerto `5432` no esta ocupado
  - validar variables de `.env`
- error `relation "... " does not exist`:
  - ejecutar el bloque SQL de la seccion 5
- `Unauthorized` en gateway:
  - verificar `Authorization: Bearer <token>`
  - comprobar `x-tenant-id` coincide con el token
- `Tenant invalido` o `Suscripcion inactiva`:
  - validar estado del tenant
  - crear/reactivar suscripcion y pago.
- error `No se puede registrar consulta sin paciente`:
  - validar `patientId` y `tenantId`
  - confirmar que el paciente fue creado en el mismo tenant
- error `relation "... " does not exist` en endpoints clinicos:
  - ejecutar bloques SQL de seccion 5 y 7
- error `La categoria no existe para el tenant`:
  - crear categoria en `categories` usando el `tenant_id` correcto
- error `Stock insuficiente para transferencia` o `No se permite stock negativo`:
  - verificar stock disponible en el almacen origen
- error `relation "... " does not exist` en endpoints de inventario:
  - ejecutar bloque SQL de seccion 11
- error `Error de comunicacion con ai-service`:
  - confirmar que `ai-service` este levantado en `http://localhost:8000`
  - validar variable `AI_SERVICE_URL` en `.env`
- error `No se pudo procesar la imagen en ai-service`:
  - validar que `imageBase64` no este vacio o truncado
  - confirmar que `mimeType` sea consistente (ej: `image/png`, `image/jpeg`)

## 15. Fase 5 - IA (imagenes clinicas)

### 15.1 Crear tablas minimas para IA

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico <<'SQL'
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id UUID NOT NULL REFERENCES patients(id),
  encounter_id UUID NOT NULL REFERENCES clinical_encounters(id),
  image_name VARCHAR(180) NOT NULL,
  mime_type VARCHAR(80) NOT NULL,
  image_base64 TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id UUID NOT NULL REFERENCES images(id),
  encounter_id UUID NOT NULL REFERENCES clinical_encounters(id),
  finding VARCHAR(120) NOT NULL,
  confidence NUMERIC(5,2) NOT NULL,
  risk_level VARCHAR(20) NOT NULL,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  processing_ms INTEGER NOT NULL DEFAULT 0,
  model_type VARCHAR(30) NOT NULL DEFAULT 'cnn',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
SQL
```

### 15.2 Procesar imagen clinica por IA

```bash
curl -X POST http://localhost:3000/gateway/clinical/records/ai/process ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"patientId\":\"PATIENT_ID\",\"encounterId\":\"ENCOUNTER_ID\",\"imageName\":\"bitewing-16.png\",\"mimeType\":\"image/png\",\"modelType\":\"unet\",\"imageBase64\":\"iVBORw0KGgoAAAANSUhEUg...\"}"
```

### 15.3 Consultar resultados IA por paciente

```bash
curl "http://localhost:3000/gateway/clinical/records/ai/results/PATIENT_ID?tenantId=TENANT_ID" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID"
```

En la cronologia clinica deben aparecer los eventos:

- `image_uploaded`
- `image_processed`
- `ai_result_generated`

## 16. Frontend (Demo + Angular + React) - implementacion base fase 12

### 16.1 Objetivo visual de esta fase

Se implemento una base funcional para las tres apps frontend con navegacion inicial, layout consistente y modo oscuro persistente.

### 16.2 Levantar frontends para prueba real

En terminales separadas:

```bash
cd frontend/demo-app
pnpm install
pnpm dev
```

```bash
cd frontend/react-app
pnpm install
pnpm dev
```

```bash
cd frontend/angular-app
pnpm install
pnpm start
```

### 16.3 Validacion visual recomendada

Validar:

- Que `demo-app`, `react-app` y `angular-app` inicien sin errores.
- Navegacion interna en cada frontend.
- Funcionamiento del cambio de tema claro/oscuro.

### 16.4 Rutas de navegacion actuales

- Admin SaaS (Angular): `/`, `/tenants`, `/suscripciones`, `/pagos`, `/modulos`, `/metricas`.
- Frontend React: `/`, `/pacientes`, `/agenda`, `/inventario`, `/ia`, `/rrhh`.
- Demo App: `/`, `/simulacion`, `/registro`.

Referencia consolidada:

- `documentacion/rutasfront.md`

### 16.5 CORS habilitado para pruebas locales

Para evitar bloqueos al consumir APIs desde frontend en desarrollo local, se habilito CORS en todos los `main.ts` de los servicios backend con:

- `origin` para `http://localhost:*`
- `credentials: true`

Si cambias dominio o puertos de frontend, valida esta politica en cada servicio.

## 17. Fase 7 - RRHH (empleados, asistencia, evaluaciones, planilla y capacitaciones)

### 17.1 Crear tablas minimas para RRHH

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico <<'SQL'
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  full_name VARCHAR(160) NOT NULL,
  document_number VARCHAR(80) NOT NULL,
  email VARCHAR(150) NOT NULL,
  role_name VARCHAR(80) NOT NULL,
  position VARCHAR(100) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  employee_id UUID NOT NULL REFERENCES employees(id),
  check_in_at TIMESTAMP NOT NULL,
  check_out_at TIMESTAMP NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'present',
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  employee_id UUID NOT NULL REFERENCES employees(id),
  evaluator_name VARCHAR(120) NOT NULL,
  score NUMERIC(5,2) NOT NULL,
  comments TEXT NULL,
  evaluated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payroll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  employee_id UUID NOT NULL REFERENCES employees(id),
  period_label VARCHAR(40) NOT NULL,
  base_amount NUMERIC(14,2) NOT NULL,
  bonus_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  deduction_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  net_amount NUMERIC(14,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'generated',
  generated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  employee_id UUID NOT NULL REFERENCES employees(id),
  title VARCHAR(180) NOT NULL,
  provider VARCHAR(140) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'scheduled',
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
SQL
```

### 17.2 Activar modulo `hr` para el tenant (si aun no esta activo)

```bash
curl -X PATCH http://localhost:3002/core/modules/status ^
  -H "Content-Type: application/json" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"moduleName\":\"hr\",\"isActive\":true}"
```

### 17.3 Crear empleado

```bash
curl -X POST http://localhost:3000/gateway/hr/employees ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"fullName\":\"Ana Torres\",\"documentNumber\":\"DNI-778899\",\"email\":\"ana.torres@demo.com\",\"roleName\":\"odontologo\",\"position\":\"Especialista restauradora\"}"
```

Guardar `employee.id` como `EMPLOYEE_ID`.

### 17.4 Registrar asistencia

```bash
curl -X POST http://localhost:3000/gateway/hr/attendance ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"employeeId\":\"EMPLOYEE_ID\",\"checkInAt\":\"2026-04-21T08:00:00Z\",\"checkOutAt\":\"2026-04-21T17:00:00Z\",\"status\":\"present\",\"notes\":\"Turno completo\"}"
```

### 17.5 Registrar evaluacion de desempeno

```bash
curl -X POST http://localhost:3000/gateway/hr/evaluations ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"employeeId\":\"EMPLOYEE_ID\",\"evaluatorName\":\"Directora Medica\",\"score\":92,\"comments\":\"Excelente atencion y cumplimiento\"}"
```

### 17.6 Generar planilla

```bash
curl -X POST http://localhost:3000/gateway/hr/payroll ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"employeeId\":\"EMPLOYEE_ID\",\"periodLabel\":\"2026-04\",\"baseAmount\":3200,\"bonusAmount\":250,\"deductionAmount\":100}"
```

### 17.7 Registrar capacitacion

```bash
curl -X POST http://localhost:3000/gateway/hr/trainings ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"employeeId\":\"EMPLOYEE_ID\",\"title\":\"Bioseguridad avanzada en odontologia\",\"provider\":\"Colegio Odontologico\",\"status\":\"completed\",\"completedAt\":\"2026-04-20T18:00:00Z\"}"
```

## 18. Fase 8 - Finanzas (cuentas, transacciones y flujo de caja)

### 18.1 Crear tablas minimas para finanzas

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico <<'SQL'
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS financial_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(150) NOT NULL,
  account_type VARCHAR(50) NOT NULL DEFAULT 'cash',
  currency VARCHAR(10) NOT NULL DEFAULT 'PEN',
  current_balance NUMERIC(14,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  account_id UUID NOT NULL REFERENCES financial_accounts(id),
  transaction_type VARCHAR(20) NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  source_module VARCHAR(40) NOT NULL DEFAULT 'manual',
  reference VARCHAR(140) NULL,
  notes TEXT NULL,
  transaction_date TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transaction_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  account_id UUID NOT NULL REFERENCES financial_accounts(id),
  entry_type VARCHAR(20) NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  description TEXT NOT NULL
);
SQL
```

### 18.2 Levantar `financial-service`

Terminal nueva:

```bash
cd apps/financial-service
pnpm install
pnpm start:dev
```

### 18.3 Verificar configuracion del gateway

Agregar en `.env` (si no existe):

- `FINANCIAL_SERVICE_URL=http://localhost:3006`

### 18.4 Crear cuenta financiera

```bash
curl -X POST http://localhost:3000/gateway/financial/accounts ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"name\":\"Caja principal\",\"accountType\":\"cash\",\"currency\":\"PEN\",\"initialBalance\":1000}"
```

Guardar `account.id` como `ACCOUNT_ID`.

### 18.5 Registrar ingreso

```bash
curl -X POST http://localhost:3000/gateway/financial/transactions ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"accountId\":\"ACCOUNT_ID\",\"transactionType\":\"income\",\"amount\":450,\"sourceModule\":\"clinical\",\"reference\":\"CONSULTA-001\",\"notes\":\"Ingreso por consulta\"}"
```

### 18.6 Registrar egreso

```bash
curl -X POST http://localhost:3000/gateway/financial/transactions ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"accountId\":\"ACCOUNT_ID\",\"transactionType\":\"expense\",\"amount\":180,\"sourceModule\":\"inventory\",\"reference\":\"COMPRA-INSUMOS-01\",\"notes\":\"Compra de materiales\"}"
```

### 18.7 Listar cuentas y transacciones

```bash
curl "http://localhost:3000/gateway/financial/accounts?tenantId=TENANT_ID" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID"
```

```bash
curl "http://localhost:3000/gateway/financial/transactions?tenantId=TENANT_ID&accountId=ACCOUNT_ID" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID"
```

### 18.8 Generar reporte de flujo de caja

```bash
curl "http://localhost:3000/gateway/financial/reports/cash-flow?tenantId=TENANT_ID" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID"
```

Debes ver:

- `totalIncome`
- `totalExpense`
- `netCashFlow`
- `event: report_generated`

### 18.9 Errores comunes en finanzas

- `Cuenta financiera no encontrada en el tenant`:
  - validar `ACCOUNT_ID` y `TENANT_ID`.
- `Saldo insuficiente para registrar egreso`:
  - registrar ingresos o reducir el monto de egreso.
- `transactionType debe ser income o expense`:
  - usar solo `income` o `expense`.

## 19. Fase 9 - Patrimonio y activos (registro, asignacion, movimientos y depreciacion)

### 19.1 Crear tablas minimas para patrimonio

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico <<'SQL'
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS asset_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(140) NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, name)
);

CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  category_id UUID NOT NULL REFERENCES asset_categories(id),
  code VARCHAR(80) NOT NULL,
  name VARCHAR(160) NOT NULL,
  description TEXT NULL,
  acquisition_date DATE NULL,
  acquisition_cost NUMERIC(14,2) NOT NULL DEFAULT 0,
  useful_life_months INTEGER NOT NULL,
  current_value NUMERIC(14,2) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS asset_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  asset_id UUID NOT NULL REFERENCES assets(id),
  employee_id UUID NOT NULL REFERENCES employees(id),
  area_name VARCHAR(140) NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
  returned_at TIMESTAMP NULL,
  notes TEXT NULL
);

CREATE TABLE IF NOT EXISTS asset_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  asset_id UUID NOT NULL REFERENCES assets(id),
  movement_type VARCHAR(40) NOT NULL,
  from_location VARCHAR(160) NULL,
  to_location VARCHAR(160) NULL,
  movement_date TIMESTAMP NOT NULL DEFAULT NOW(),
  notes TEXT NULL
);

CREATE TABLE IF NOT EXISTS depreciation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  asset_id UUID NOT NULL REFERENCES assets(id),
  period_label VARCHAR(30) NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  previous_value NUMERIC(14,2) NOT NULL,
  new_value NUMERIC(14,2) NOT NULL,
  method VARCHAR(40) NOT NULL DEFAULT 'straight_line',
  financial_account_id UUID NULL REFERENCES financial_accounts(id),
  depreciation_date TIMESTAMP NOT NULL DEFAULT NOW(),
  notes TEXT NULL
);
SQL
```

### 19.2 Levantar `assets-service`

Terminal nueva:

```bash
cd apps/assets-service
pnpm install
pnpm start:dev
```

### 19.3 Verificar configuracion del gateway

Agregar en `.env` (si no existe):

- `ASSETS_SERVICE_URL=http://localhost:3007`

### 19.4 Activar modulo `assets` para el tenant

```bash
curl -X PATCH http://localhost:3002/core/modules/status ^
  -H "Content-Type: application/json" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"moduleName\":\"assets\",\"isActive\":true}"
```

### 19.5 Crear categoria patrimonial

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico <<'SQL'
INSERT INTO asset_categories (tenant_id, name, description)
VALUES ('TENANT_ID', 'Equipos odontologicos', 'Activos operativos de clinica')
ON CONFLICT (tenant_id, name) DO NOTHING;
SQL
```

### 19.6 Obtener `ASSET_CATEGORY_ID`

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico -c "SELECT id, name FROM asset_categories WHERE tenant_id = 'TENANT_ID';"
```

### 19.7 Registrar activo

```bash
curl -X POST http://localhost:3000/gateway/assets/assets ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"categoryId\":\"ASSET_CATEGORY_ID\",\"code\":\"EQ-OD-001\",\"name\":\"Sillon odontologico A1\",\"description\":\"Unidad principal de atencion\",\"acquisitionDate\":\"2026-01-15\",\"acquisitionCost\":12500,\"usefulLifeMonths\":120,\"currentValue\":12500,\"status\":\"active\"}"
```

Guardar `asset.id` como `ASSET_ID`.

### 19.8 Asignar activo a empleado

```bash
curl -X POST http://localhost:3000/gateway/assets/assignments ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"assetId\":\"ASSET_ID\",\"employeeId\":\"EMPLOYEE_ID\",\"areaName\":\"Consultorio 1\",\"notes\":\"Asignacion inicial a odontologia restauradora\"}"
```

### 19.9 Registrar movimiento de activo

```bash
curl -X POST http://localhost:3000/gateway/assets/movements ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"assetId\":\"ASSET_ID\",\"movementType\":\"maintenance\",\"fromLocation\":\"Consultorio 1\",\"toLocation\":\"Servicio tecnico\",\"notes\":\"Mantenimiento preventivo trimestral\"}"
```

### 19.10 Registrar depreciacion

```bash
curl -X POST http://localhost:3000/gateway/assets/depreciation ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"assetId\":\"ASSET_ID\",\"periodLabel\":\"2026-04\",\"amount\":104.17,\"method\":\"straight_line\",\"financialAccountId\":\"ACCOUNT_ID\",\"notes\":\"Depreciacion mensual de abril\"}"
```

Debes observar `event` de salida:

- `asset_created`
- `asset_assigned`
- `asset_moved`
- `asset_depreciated`

### 19.11 Errores comunes en patrimonio

- `La categoria del activo no existe para el tenant`:
  - validar `ASSET_CATEGORY_ID` y `TENANT_ID`.
- `El empleado no existe en el tenant`:
  - confirmar que `EMPLOYEE_ID` pertenece al mismo tenant.
- `El activo ya se encuentra asignado a otro empleado`:
  - registrar primero movimiento `return` para cerrar asignacion activa.
- `No existe asignacion activa para cerrar retorno`:
  - revisar historial en `asset_assignments` antes de usar `movementType=return`.
- `Activo no encontrado en el tenant`:
  - validar `ASSET_ID` y cabecera `x-tenant-id`.

## 20. Fase 10 - Agendamiento (horarios, disponibilidad y citas)

### 20.1 Crear tablas minimas para agendamiento

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico <<'SQL'
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  professional_id UUID NOT NULL REFERENCES employees(id),
  day_of_week SMALLINT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CHECK (day_of_week BETWEEN 0 AND 6),
  CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  professional_id UUID NOT NULL REFERENCES employees(id),
  available_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'available',
  source VARCHAR(20) NOT NULL DEFAULT 'schedule',
  appointment_id UUID NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CHECK (status IN ('available', 'blocked', 'booked')),
  CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id UUID NOT NULL REFERENCES patients(id),
  professional_id UUID NOT NULL REFERENCES employees(id),
  scheduled_at TIMESTAMP NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  reason VARCHAR(255) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  cancelled_at TIMESTAMP NULL,
  CHECK (status IN ('pending', 'confirmed', 'attended', 'cancelled')),
  CHECK (duration_minutes > 0)
);

CREATE INDEX IF NOT EXISTS idx_schedules_tenant_professional
  ON schedules (tenant_id, professional_id);
CREATE INDEX IF NOT EXISTS idx_availability_tenant_professional_date
  ON availability (tenant_id, professional_id, available_date);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_professional_datetime
  ON appointments (tenant_id, professional_id, scheduled_at);
SQL
```

### 20.2 Levantar `scheduling-service`

Terminal nueva:

```bash
cd apps/scheduling-service
pnpm install
pnpm start:dev
```

### 20.3 Verificar configuracion del gateway

Agregar en `.env` (si no existe):

- `SCHEDULING_SERVICE_URL=http://localhost:3008`

### 20.4 Activar modulo `scheduling` para el tenant

```bash
curl -X PATCH http://localhost:3002/core/modules/status ^
  -H "Content-Type: application/json" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"moduleName\":\"scheduling\",\"isActive\":true}"
```

### 20.5 Crear horario base del profesional

```bash
curl -X POST http://localhost:3000/gateway/scheduling/schedules ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"professionalId\":\"EMPLOYEE_ID\",\"dayOfWeek\":2,\"startTime\":\"09:00\",\"endTime\":\"13:00\"}"
```

### 20.6 Consultar disponibilidad del profesional

```bash
curl "http://localhost:3000/gateway/scheduling/availability?tenantId=TENANT_ID&professionalId=EMPLOYEE_ID&from=2026-04-22&to=2026-04-22" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID"
```

### 20.7 Crear cita

```bash
curl -X POST http://localhost:3000/gateway/scheduling/appointments ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"patientId\":\"PATIENT_ID\",\"professionalId\":\"EMPLOYEE_ID\",\"scheduledAt\":\"2026-04-22T09:00:00Z\",\"durationMinutes\":30,\"reason\":\"Evaluacion inicial\"}"
```

Guardar `appointment.id` como `APPOINTMENT_ID`.

### 20.8 Reprogramar cita

```bash
curl -X PATCH http://localhost:3000/gateway/scheduling/appointments/APPOINTMENT_ID/reschedule ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"scheduledAt\":\"2026-04-22T10:00:00Z\"}"
```

### 20.9 Confirmar y marcar como atendida

```bash
curl -X PATCH http://localhost:3000/gateway/scheduling/appointments/APPOINTMENT_ID/status ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"status\":\"confirmed\"}"
```

```bash
curl -X PATCH http://localhost:3000/gateway/scheduling/appointments/APPOINTMENT_ID/status ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"status\":\"attended\"}"
```

### 20.10 Cancelar cita (flujo alterno)

```bash
curl -X PATCH http://localhost:3000/gateway/scheduling/appointments/APPOINTMENT_ID/cancel ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"reason\":\"Paciente no disponible\"}"
```

### 20.11 Listar citas del tenant

```bash
curl "http://localhost:3000/gateway/scheduling/appointments?tenantId=TENANT_ID&professionalId=EMPLOYEE_ID&from=2026-04-22&to=2026-04-30" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID"
```

### 20.12 Validaciones esperadas en agendamiento

- No permitir dos citas superpuestas para el mismo `professionalId`.
- Rechazar creacion de cita sin `patientId` o sin `professionalId`.
- Rechazar estados fuera de `pending|confirmed|attended|cancelled`.
- Rechazar horarios con `endTime <= startTime`.

### 20.13 Errores comunes en agendamiento

- `No hay disponibilidad para el profesional en ese horario`:
  - validar bloque horario y disponibilidad real antes de crear/reprogramar.
- `Cita superpuesta detectada para el profesional`:
  - mover la cita a otro bloque libre.
- `No se permite cambiar de cancelled a attended`:
  - crear nueva cita en vez de reutilizar una cancelada.
- `Profesional no pertenece al tenant`:
  - revisar `EMPLOYEE_ID` y cabecera `x-tenant-id`.

## 21. Fase 11 - Servicios externos (email, WhatsApp y archivos)

### 21.1 Levantar microservicios externos

En nuevas terminales:

```bash
cd services/email-service
pnpm install
pnpm start:dev
```

```bash
cd services/whatsapp-service
pnpm install
pnpm start:dev
```

```bash
cd services/file-service
pnpm install
pnpm start:dev
```

### 21.2 Verificar variables de entorno del gateway

Agregar en `.env` (si no existen):

- `EMAIL_SERVICE_URL=http://localhost:3011`
- `WHATSAPP_SERVICE_URL=http://localhost:3012`
- `FILE_SERVICE_URL=http://localhost:3013`

### 21.3 Enviar notificacion por email (via gateway)

```bash
curl -X POST http://localhost:3000/gateway/notifications/email ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"to\":\"paciente@demo.com\",\"subject\":\"Recordatorio de cita\",\"template\":\"appointment_reminder\",\"variables\":{\"patientName\":\"Maria Perez\",\"appointmentDate\":\"2026-04-23T15:00:00Z\"}}"
```

### 21.4 Enviar notificacion por WhatsApp (via gateway)

```bash
curl -X POST http://localhost:3000/gateway/notifications/whatsapp ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"phoneNumber\":\"+51999999999\",\"message\":\"Tu cita fue confirmada para el jueves 3:00 PM\",\"eventType\":\"appointment_confirmation\"}"
```

### 21.5 Subir archivo clinico (via gateway)

```bash
curl -X POST http://localhost:3000/gateway/files/upload ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"patientId\":\"PATIENT_ID\",\"encounterId\":\"ENCOUNTER_ID\",\"sourceModule\":\"clinical\",\"fileName\":\"radiografia_16.png\",\"mimeType\":\"image/png\",\"fileBase64\":\"iVBORw0KGgoAAAANSUhEUg...\"}"
```

Guardar `id` retornado como `FILE_ID`.

### 21.6 Consultar metadatos de archivo

```bash
curl "http://localhost:3000/gateway/files/FILE_ID?tenantId=TENANT_ID" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID"
```

### 21.7 Validaciones y errores esperados

- Email invalido: `Correo de destino invalido`.
- Telefono invalido: `Numero de telefono invalido`.
- Tipo de archivo invalido: `Tipo de archivo no permitido`.
- Archivo muy grande: `Archivo supera el tamano maximo permitido`.
- Tenant no coincide con token: `Tenant no coincide con el token`.

## 22. Fase 14 - Seguridad avanzada (auditoria, RBAC/ABAC, sesiones y rate limiting)

### 22.1 Crear tablas minimas de seguridad y auditoria

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico <<'SQL'
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(80) NOT NULL,
  description TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, name)
);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_name VARCHAR(60) NOT NULL,
  action_name VARCHAR(80) NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (module_name, action_name)
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id),
  permission_id UUID NOT NULL REFERENCES permissions(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  refresh_token_hash TEXT NOT NULL,
  ip_address VARCHAR(64) NULL,
  user_agent TEXT NULL,
  is_revoked BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID NULL,
  action VARCHAR(120) NOT NULL,
  resource VARCHAR(120) NOT NULL,
  resource_id UUID NULL,
  status VARCHAR(20) NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address VARCHAR(64) NULL,
  user_agent TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NULL REFERENCES tenants(id),
  user_id UUID NULL,
  method VARCHAR(10) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  status_code INTEGER NOT NULL,
  duration_ms INTEGER NOT NULL DEFAULT 0,
  ip_address VARCHAR(64) NULL,
  request_id VARCHAR(100) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_created_at
  ON audit_logs (tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_logs_endpoint_created_at
  ON access_logs (endpoint, created_at DESC);
SQL
```

### 22.2 Sembrar permisos base y rol administrador

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico <<'SQL'
INSERT INTO permissions (module_name, action_name, description) VALUES
('core', 'tenants.read', 'Ver informacion de tenants'),
('clinical', 'patients.create', 'Registrar pacientes'),
('clinical', 'records.write', 'Registrar datos clinicos'),
('inventory', 'stock.manage', 'Gestionar movimientos de stock'),
('hr', 'employees.manage', 'Gestionar empleados'),
('financial', 'transactions.manage', 'Gestionar transacciones'),
('assets', 'assets.manage', 'Gestionar activos'),
('scheduling', 'appointments.manage', 'Gestionar citas')
ON CONFLICT (module_name, action_name) DO NOTHING;
SQL
```

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico <<'SQL'
INSERT INTO roles (tenant_id, name, description)
VALUES ('TENANT_ID', 'admin', 'Rol administrador del tenant')
ON CONFLICT (tenant_id, name) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.tenant_id = 'TENANT_ID'
  AND r.name = 'admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;
SQL
```

### 22.3 Verificar control de acceso (permitido y denegado)

Flujo esperado:

1. Hacer una llamada autorizada con `ACCESS_TOKEN` valido y `x-tenant-id`.
2. Probar una llamada sin token o con token invalido.
3. Probar una llamada con permiso insuficiente (usuario no admin o sin permiso asociado).

Ejemplo de acceso sin token (debe responder `401 Unauthorized`):

```bash
curl "http://localhost:3000/gateway/core/tenants/TENANT_ID/status?module=clinical"
```

Ejemplo con token valido (debe responder `200`):

```bash
curl "http://localhost:3000/gateway/core/tenants/TENANT_ID/status?module=clinical" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID"
```

### 22.4 Probar rate limiting en login

Ejecuta varias veces en rafaga (10-20 intentos) con credenciales invalidas:

```bash
curl -X POST http://localhost:3000/gateway/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@demo.com\",\"password\":\"incorrecta\",\"tenantId\":\"TENANT_ID\"}"
```

Resultado esperado:

- Primeros intentos: `401 Unauthorized`.
- Al exceder umbral: `429 Too Many Requests`.

### 22.5 Probar sesiones y revocacion

1. Iniciar sesion y guardar `ACCESS_TOKEN`.
2. Ejecutar endpoint de logout/revocacion del auth-service (si esta expuesto por gateway).
3. Reintentar un endpoint protegido con el token revocado.

Resultado esperado:

- Luego de revocar sesion, el acceso debe ser denegado (`401` o `403` segun implementacion).

### 22.6 Consultar trazabilidad en `audit_logs` y `access_logs`

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico -c "SELECT tenant_id, action, resource, status, created_at FROM audit_logs WHERE tenant_id = 'TENANT_ID' ORDER BY created_at DESC LIMIT 20;"
```

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico -c "SELECT method, endpoint, status_code, duration_ms, created_at FROM access_logs ORDER BY created_at DESC LIMIT 20;"
```

Debes observar:

- eventos de acciones criticas (crear paciente, registrar consulta, etc.)
- accesos permitidos y denegados con su codigo HTTP
- timestamp y tenant consistentes

### 22.7 Errores comunes en Fase 14

- `Unauthorized` aun con token:
  - validar expiracion del JWT y `x-tenant-id`.
- `Forbidden` en endpoints validos:
  - revisar asignacion de rol/permisos en `role_permissions`.
- no aparecen registros en `audit_logs`:
  - verificar middleware/interceptor de auditoria en gateway o servicio.
- no aparecen registros en `access_logs`:
  - validar middleware global de logging y escritura en BD.
- no se activa rate limiting:
  - confirmar configuracion del limitador en gateway y entorno local.

## 23. Fase 15 - Observabilidad, monitoreo y trazabilidad

### 23.1 Stack de observabilidad en Docker

Levanta todo con:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Verifica que esten arriba:

- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3009` (usuario `admin`, clave `admin`)

### 23.2 Endpoints de salud por servicio

Todos los servicios exponen:

- `GET /health`
- `GET /metrics`

Ejemplos rapidos:

```bash
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
curl http://localhost:3005/health
curl http://localhost:3006/health
curl http://localhost:3007/health
curl http://localhost:3008/health
curl http://localhost:3011/health
curl http://localhost:3012/health
curl http://localhost:3013/health
curl http://localhost:8000/health
```

### 23.3 Validar scraping en Prometheus

Abre `http://localhost:9090/targets` y confirma estado `UP` para:

- `api-gateway`
- `auth-service`
- `core-service`
- `clinical-service`
- `inventory-service`
- `hr-service`
- `financial-service`
- `assets-service`
- `scheduling-service`
- `email-service`
- `whatsapp-service`
- `file-service`
- `ai-service`

### 23.4 Ver metricas basicas

Consulta directa:

```bash
curl http://localhost:3000/metrics
curl http://localhost:3001/metrics
curl http://localhost:8000/metrics
```

Metricas base esperadas (Node):

- `nodejs_process_uptime_seconds`
- `nodejs_process_resident_memory_bytes`
- `nodejs_heap_used_bytes`

### 23.5 Trazabilidad distribuida con `x-trace-id`

Puedes enviar un trace manual:

```bash
curl "http://localhost:3000/gateway/core/tenants/TENANT_ID/status?module=clinical" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID" ^
  -H "x-trace-id: TRACE-DEMO-001"
```

Validaciones:

- La respuesta debe incluir `x-trace-id`.
- En logs de servicio debe aparecer el mismo `traceId`.
- Si no envias `x-trace-id`, el servicio lo genera automaticamente.

### 23.6 Alertas recomendadas en Grafana

Configura alertas sobre:

- Servicio caido: `up == 0`.
- Memoria alta sostenida (`nodejs_process_resident_memory_bytes`).
- Degradacion de tiempo de respuesta (basado en logs/metricas extendidas).

### 23.7 Errores comunes en observabilidad

- No aparece un target en Prometheus:
  - confirmar que el servicio este arriba y exponga `/metrics`.
- `DOWN` en `targets`:
  - validar nombre de servicio y puerto en `docker/prometheus.yml`.
- No ves `traceId` en logs:
  - revisar que la llamada pase por el `main.ts` instrumentado del servicio.

## 24. Fase 17 - Calidad, cumplimiento y preparacion para certificacion

### 24.1 Objetivo de esta validacion final

Consolidar evidencia tecnica y funcional para demostrar:

- calidad del producto software
- trazabilidad completa
- cumplimiento de seguridad
- preparacion para auditoria y certificacion

### 24.2 Checklist rapido de cumplimiento

Antes de cerrar fase 17, validar:

- Documentacion tecnica actualizada (arquitectura, APIs, base de datos, flujos).
- Manual de usuario actualizado para pruebas end-to-end.
- Registro de avance de fase (`documentacion/avance/fase_17.md`) completado.
- Auditoria activa con eventos en `audit_logs` y `access_logs`.
- Controles de acceso y sesiones funcionando (401/403/429 segun caso).
- Observabilidad activa (`/health`, `/metrics`, Prometheus y Grafana).

### 24.3 Validaciones minimas de auditoria

Consultar ultimos eventos de auditoria:

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico -c "SELECT tenant_id, action, resource, status, created_at FROM audit_logs WHERE tenant_id = 'TENANT_ID' ORDER BY created_at DESC LIMIT 20;"
```

Consultar ultimos accesos HTTP:

```bash
docker exec -i saas_postgres psql -U postgres -d saasodontologico -c "SELECT method, endpoint, status_code, duration_ms, created_at FROM access_logs ORDER BY created_at DESC LIMIT 20;"
```

Debe existir trazabilidad de:

- acciones criticas de negocio
- accesos permitidos y denegados
- correlacion por tenant y tiempo

### 24.4 Validaciones minimas de calidad de software

Ejecutar pruebas de salud y metricas:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/metrics
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
```

Verificar en Prometheus:

- `http://localhost:9090/targets` con estado `UP` en servicios criticos.

Verificar en Grafana:

- dashboard con memoria, uptime y estado de servicios.

### 24.5 Evidencia recomendada para auditoria interna

Guardar en carpeta de evidencias (definida por el equipo):

- capturas de `targets` en Prometheus
- capturas de dashboards y alertas en Grafana
- export de consultas SQL de `audit_logs` y `access_logs`
- resultados de pruebas funcionales y de seguridad
- version de manual y documentos usados en la validacion

### 24.6 Criterio de cierre de fase 17

La fase se considera cerrada cuando:

- el sistema mantiene trazabilidad y controles de seguridad activos
- la documentacion obligatoria esta completa y vigente
- existe evidencia verificable de pruebas funcionales, integracion y aceptacion
- el equipo deja registro formal de decisiones tecnicas y riesgos residuales

## 25. Fase 18 - Lanzamiento, operacion y crecimiento

### 25.1 Checklist pre-lanzamiento (go-live)

Antes de habilitar usuarios reales:

- confirmar que todos los servicios criticos responden `/health`
- validar que `docker compose -f docker/docker-compose.yml up -d` deja servicios en estado `Up`
- confirmar variables de entorno de produccion (URLs, JWT, credenciales DB, servicios externos)
- confirmar certificado HTTPS y dominio de API/frontend operativo
- ejecutar respaldo de base de datos previo al lanzamiento

### 25.2 Validacion tecnica de salida

Comprobar en orden:

```bash
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3000/metrics
```

Si usas observabilidad:

- Prometheus: `http://localhost:9090/targets` en estado `UP`
- Grafana: dashboard con uptime/memoria/estado de servicios

### 25.3 Alta del primer tenant real

Crear tenant piloto:

```bash
curl -X POST http://localhost:3002/core/tenants ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Clinica Piloto Produccion\"}"
```

Registrar suscripcion:

```bash
curl -X POST http://localhost:3002/core/subscriptions ^
  -H "Content-Type: application/json" ^
  -d "{\"tenantId\":\"TENANT_ID\",\"plan\":\"pro\",\"durationDays\":30}"
```

Validar estado del tenant/modulo:

```bash
curl "http://localhost:3000/gateway/core/tenants/TENANT_ID/status?module=clinical" ^
  -H "Authorization: Bearer ACCESS_TOKEN" ^
  -H "x-tenant-id: TENANT_ID"
```

### 25.4 Smoke test funcional minimo en produccion

Ejecutar al menos:

1. login valido por gateway
2. una operacion funcional de negocio (ej: registrar paciente o crear cita)
3. una consulta de datos persistidos
4. una notificacion externa (email/whatsapp) si aplica
5. validacion en `audit_logs` y `access_logs`

### 25.5 Operacion diaria recomendada

- revisar diariamente estado de servicios y consumo de recursos
- revisar tickets/incidencias y clasificar por severidad
- analizar errores repetitivos y crear accion correctiva
- mantener bitacora de cambios, despliegues y decisiones operativas

### 25.6 Soporte y escalamiento de incidencias

SLA sugerido:

- critico: atencion inmediata, objetivo de restauracion < 4h
- alto: atencion prioritaria en el dia
- medio/bajo: segun cola de soporte y roadmap

Registrar por ticket:

- tenant afectado
- modulo afectado
- evidencia (log, traceId, endpoint)
- causa raiz (si aplica)
- accion correctiva y preventiva

### 25.7 Cierre formal de fase 18

La fase se considera cerrada cuando:

- sistema desplegado y estable en entorno productivo
- tenant piloto operando sin bloqueos criticos
- soporte operativo activo con trazabilidad de incidencias
- metricas iniciales registradas (tenants, usuarios, disponibilidad, incidencias)
- registro completado en `documentacion/avance/fase_18.md`

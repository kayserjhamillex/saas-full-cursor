-- =============================================================================
-- SaaS Odontológico — datastart (esquema mínimo + datos iniciales)
-- Alineado con los INSERT/SELECT de apps/* (Nest + pg).
-- Idempotente: tablas IF NOT EXISTS; filas con ON CONFLICT DO NOTHING.
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- Esquema (orden respetando FKs)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  status VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password TEXT NOT NULL,
  role_id UUID NULL REFERENCES roles (id) ON DELETE SET NULL,
  UNIQUE (tenant_id, email)
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  plan VARCHAR(64) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  amount NUMERIC(14, 2) NOT NULL,
  payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS tenant_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  module_name VARCHAR(64) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (tenant_id, module_name)
);

CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  document VARCHAR(64) NOT NULL,
  birth_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS clinical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS clinical_encounters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID NOT NULL REFERENCES clinical_records (id) ON DELETE CASCADE,
  encounter_date TIMESTAMPTZ NOT NULL,
  notes TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID NOT NULL REFERENCES clinical_encounters (id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID NOT NULL REFERENCES clinical_encounters (id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID NOT NULL REFERENCES clinical_encounters (id) ON DELETE CASCADE,
  medication VARCHAR(255) NOT NULL,
  dosage VARCHAR(255) NOT NULL,
  instructions TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID NOT NULL REFERENCES clinical_encounters (id) ON DELETE CASCADE,
  notes TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS odontograms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL UNIQUE REFERENCES patients (id) ON DELETE CASCADE,
  chart_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clinical_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
  event_type VARCHAR(64) NOT NULL,
  reference_id UUID NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
  encounter_id UUID NOT NULL REFERENCES clinical_encounters (id) ON DELETE CASCADE,
  image_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(128) NOT NULL,
  image_base64 TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id UUID NOT NULL REFERENCES images (id) ON DELETE CASCADE,
  encounter_id UUID NOT NULL REFERENCES clinical_encounters (id) ON DELETE CASCADE,
  finding TEXT NOT NULL,
  confidence DOUBLE PRECISION NOT NULL,
  risk_level VARCHAR(32) NOT NULL,
  recommendations JSONB NOT NULL,
  processing_ms INTEGER NOT NULL,
  model_type VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories (id) ON DELETE RESTRICT,
  subcategory_id UUID NULL,
  sku VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  UNIQUE (tenant_id, sku)
);

CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  from_warehouse_id UUID NOT NULL REFERENCES warehouses (id) ON DELETE RESTRICT,
  to_warehouse_id UUID NOT NULL REFERENCES warehouses (id) ON DELETE RESTRICT,
  quantity NUMERIC(18, 4) NOT NULL,
  status VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES warehouses (id) ON DELETE RESTRICT,
  movement_type VARCHAR(32) NOT NULL,
  quantity NUMERIC(18, 4) NOT NULL,
  reference TEXT NULL,
  notes TEXT NULL,
  transfer_id UUID NULL REFERENCES transfers (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kardex_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES warehouses (id) ON DELETE RESTRICT,
  movement_id UUID NOT NULL REFERENCES inventory_movements (id) ON DELETE CASCADE,
  movement_type VARCHAR(32) NOT NULL,
  quantity_in NUMERIC(18, 4) NOT NULL,
  quantity_out NUMERIC(18, 4) NOT NULL,
  balance NUMERIC(18, 4) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES warehouses (id) ON DELETE CASCADE,
  quantity NUMERIC(18, 4) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, product_id, warehouse_id)
);

CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  document_number VARCHAR(64) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role_name VARCHAR(128) NOT NULL,
  position VARCHAR(128) NOT NULL,
  status VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees (id) ON DELETE CASCADE,
  check_in_at TIMESTAMPTZ NOT NULL,
  check_out_at TIMESTAMPTZ NULL,
  status VARCHAR(32) NOT NULL,
  notes TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees (id) ON DELETE CASCADE,
  evaluator_name VARCHAR(255) NOT NULL,
  score NUMERIC(5, 2) NOT NULL,
  comments TEXT NULL,
  evaluated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS payroll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees (id) ON DELETE CASCADE,
  period_label VARCHAR(64) NOT NULL,
  base_amount NUMERIC(14, 2) NOT NULL,
  bonus_amount NUMERIC(14, 2) NOT NULL,
  deduction_amount NUMERIC(14, 2) NOT NULL,
  net_amount NUMERIC(14, 2) NOT NULL,
  status VARCHAR(32) NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees (id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  status VARCHAR(32) NOT NULL,
  completed_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financial_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  account_type VARCHAR(64) NOT NULL,
  currency VARCHAR(8) NOT NULL,
  current_balance NUMERIC(18, 4) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES financial_accounts (id) ON DELETE RESTRICT,
  transaction_type VARCHAR(16) NOT NULL,
  amount NUMERIC(18, 4) NOT NULL,
  source_module VARCHAR(64) NOT NULL,
  reference TEXT NULL,
  notes TEXT NULL,
  transaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transaction_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions (id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES financial_accounts (id) ON DELETE RESTRICT,
  entry_type VARCHAR(16) NOT NULL,
  amount NUMERIC(18, 4) NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS asset_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES asset_categories (id) ON DELETE RESTRICT,
  code VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  acquisition_date DATE NULL,
  acquisition_cost NUMERIC(18, 4) NOT NULL,
  useful_life_months INTEGER NOT NULL,
  current_value NUMERIC(18, 4) NOT NULL,
  status VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS asset_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES assets (id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees (id) ON DELETE RESTRICT,
  area_name VARCHAR(255) NULL,
  assigned_at TIMESTAMPTZ NOT NULL,
  returned_at TIMESTAMPTZ NULL,
  notes TEXT NULL
);

CREATE TABLE IF NOT EXISTS asset_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES assets (id) ON DELETE CASCADE,
  movement_type VARCHAR(32) NOT NULL,
  from_location TEXT NULL,
  to_location TEXT NULL,
  movement_date TIMESTAMPTZ NOT NULL,
  notes TEXT NULL
);

CREATE TABLE IF NOT EXISTS depreciation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES assets (id) ON DELETE CASCADE,
  period_label VARCHAR(64) NOT NULL,
  amount NUMERIC(18, 4) NOT NULL,
  previous_value NUMERIC(18, 4) NOT NULL,
  new_value NUMERIC(18, 4) NOT NULL,
  method VARCHAR(64) NOT NULL,
  financial_account_id UUID NULL REFERENCES financial_accounts (id) ON DELETE SET NULL,
  depreciation_date TIMESTAMPTZ NOT NULL,
  notes TEXT NULL
);

-- ---------------------------------------------------------------------------
-- Datos iniciales (UUID fijos para documentación y pruebas)
-- ---------------------------------------------------------------------------

INSERT INTO tenants (id, name, status, created_at, deleted_at)
VALUES (
    'a0000001-0001-4001-8001-000000000001'::uuid,
    'Clínica Demo Datastart',
    'active',
    NOW(),
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO roles (id, name)
VALUES ('a0000001-0001-4001-8001-000000000002'::uuid, 'admin')
ON CONFLICT (id) DO NOTHING;

-- Contraseña en texto plano (solo dev): Admin123!
INSERT INTO users (id, tenant_id, email, password, role_id)
VALUES (
    'a0000001-0001-4001-8001-000000000003'::uuid,
    'a0000001-0001-4001-8001-000000000001'::uuid,
    'admin@datastart.local',
    '$2b$10$Kv4SDbxCp4lWw58x1bD.DuOSH/ZZ/uACd3cgqQYyzdSz6RJKAUi9S',
    'a0000001-0001-4001-8001-000000000002'::uuid
  )
ON CONFLICT (tenant_id, email) DO NOTHING;

INSERT INTO subscriptions (id, tenant_id, plan, start_date, end_date, status)
VALUES (
    'a0000001-0001-4001-8001-000000000004'::uuid,
    'a0000001-0001-4001-8001-000000000001'::uuid,
    'professional',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '1 year',
    'active'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO payments (id, tenant_id, amount, payment_date, status)
VALUES (
    'a0000001-0001-4001-8001-000000000005'::uuid,
    'a0000001-0001-4001-8001-000000000001'::uuid,
    99.00,
    NOW(),
    'paid'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO tenant_modules (id, tenant_id, module_name, is_active)
VALUES
  ('a0000001-0001-4001-8001-0000000000f1'::uuid, 'a0000001-0001-4001-8001-000000000001'::uuid, 'core', TRUE),
  ('a0000001-0001-4001-8001-0000000000f2'::uuid, 'a0000001-0001-4001-8001-000000000001'::uuid, 'clinical', TRUE),
  ('a0000001-0001-4001-8001-0000000000f3'::uuid, 'a0000001-0001-4001-8001-000000000001'::uuid, 'inventory', TRUE),
  ('a0000001-0001-4001-8001-0000000000f4'::uuid, 'a0000001-0001-4001-8001-000000000001'::uuid, 'financial', TRUE),
  ('a0000001-0001-4001-8001-0000000000f5'::uuid, 'a0000001-0001-4001-8001-000000000001'::uuid, 'hr', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO patients (id, tenant_id, name, document, birth_date, created_at, deleted_at)
VALUES (
    'a0000001-0001-4001-8001-000000000006'::uuid,
    'a0000001-0001-4001-8001-000000000001'::uuid,
    'Paciente Demo',
    'DOC-0001',
    '1990-05-15',
    NOW(),
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO clinical_records (id, patient_id, created_at, deleted_at)
VALUES (
    'a0000001-0001-4001-8001-000000000007'::uuid,
    'a0000001-0001-4001-8001-000000000006'::uuid,
    NOW(),
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO clinical_encounters (id, record_id, encounter_date, notes, created_at, deleted_at)
VALUES (
    'a0000001-0001-4001-8001-000000000010'::uuid,
    'a0000001-0001-4001-8001-000000000007'::uuid,
    NOW(),
    'Consulta inicial de demostración (datastart).',
    NOW(),
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, tenant_id, name, created_at, deleted_at)
VALUES (
    'a0000001-0001-4001-8001-000000000008'::uuid,
    'a0000001-0001-4001-8001-000000000001'::uuid,
    'Insumos odontológicos',
    NOW(),
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, tenant_id, category_id, subcategory_id, sku, name, unit, created_at, deleted_at)
VALUES (
    'a0000001-0001-4001-8001-000000000009'::uuid,
    'a0000001-0001-4001-8001-000000000001'::uuid,
    'a0000001-0001-4001-8001-000000000008'::uuid,
    NULL,
    'SKU-GUAS-DEMO',
    'Guantes nitrilo caja',
    'caja',
    NOW(),
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO warehouses (id, tenant_id, name, created_at, deleted_at)
VALUES (
    'a0000001-0001-4001-8001-00000000000a'::uuid,
    'a0000001-0001-4001-8001-000000000001'::uuid,
    'Almacén principal',
    NOW(),
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO stock (id, tenant_id, product_id, warehouse_id, quantity, updated_at)
VALUES (
    'a0000001-0001-4001-8001-00000000000b'::uuid,
    'a0000001-0001-4001-8001-000000000001'::uuid,
    'a0000001-0001-4001-8001-000000000009'::uuid,
    'a0000001-0001-4001-8001-00000000000a'::uuid,
    25,
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO employees (id, tenant_id, full_name, document_number, email, role_name, position, status, created_at)
VALUES (
    'a0000001-0001-4001-8001-00000000000c'::uuid,
    'a0000001-0001-4001-8001-000000000001'::uuid,
    'María Recursos Humanos',
    'EMP-001',
    'maria.rrhh@datastart.local',
    'coordinador',
    'Coordinadora clínica',
    'active',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO financial_accounts (id, tenant_id, name, account_type, currency, current_balance, is_active, created_at)
VALUES (
    'a0000001-0001-4001-8001-00000000000d'::uuid,
    'a0000001-0001-4001-8001-000000000001'::uuid,
    'Caja general',
    'asset',
    'USD',
    0,
    TRUE,
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO asset_categories (id, tenant_id, name, created_at)
VALUES (
    'a0000001-0001-4001-8001-00000000000e'::uuid,
    'a0000001-0001-4001-8001-000000000001'::uuid,
    'Equipo clínico',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

COMMIT;

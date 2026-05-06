# CANVAS TÉCNICO — DISEÑO DE BASE DE DATOS ENTERPRISE POR MÓDULOS

---

## 1. Descripción de la fase

Se define el modelo de datos relacional completo del sistema SaaS clínico, integrando dominios clínicos, administrativos y ERP bajo un esquema **multi-tenant escalable**. El diseño garantiza:

* Trazabilidad completa
* Consistencia transaccional
* Escalabilidad horizontal por servicios
* Extensibilidad sin rediseño

---

## 2. Objetivo técnico

Diseñar una base de datos PostgreSQL que:

* Soporte múltiples clínicas (multi-tenant)
* Integre módulos clínicos, ERP y SaaS
* Garantice integridad y rendimiento
* Permita evolución sin refactorización estructural

---

## 3. Carpetas involucradas (OBLIGATORIO)

* /documentacion/database
* /apps/core-service
* /apps/auth-service
* /apps/clinical-service
* /apps/inventory-service
* /apps/financial-service
* /apps/hr-service
* /ai-service

---

## 4. Responsabilidades por carpeta

* /documentacion/database → definición oficial del modelo
* /apps/* → implementación de acceso a datos
* /ai-service → almacenamiento de resultados IA

---

## 5. Flujo de datos paso a paso

1. Request llega a microservicio
2. Se valida tenant_id
3. Se ejecuta query parametrizada
4. Se respeta integridad referencial
5. Se retorna resultado

---

## 6. Interacción entre microservicios

* Cada servicio accede a su dominio
* Integración mediante APIs
* ❌ No acceso cruzado a tablas de otros dominios

---

## 7. Eventos (event-driven)

* inventory_updated
* asset_assigned
* diagnosis_created
* payment_completed

---

## 8. Estructura lógica interna

* PK: UUID
* tenant_id en TODAS las tablas
* soft delete: deleted_at
* timestamps: created_at, updated_at

---

# 🔷 9. MÓDULOS Y TABLAS

---

## 🟦 SaaS

### tenants

* id (uuid, PK)
* name (varchar)
* status (varchar)
* created_at (timestamp)
* deleted_at (timestamp)

Índices: id, status
Reglas: tenant activo obligatorio

---

### subscriptions

* id
* tenant_id (FK)
* plan
* start_date
* end_date
* status

Índices: tenant_id

---

### payments

* id
* tenant_id
* amount
* payment_date
* status

---

### tenant_modules

* id
* tenant_id
* module_name
* is_active

---

## 🟦 Seguridad

### users

* id
* tenant_id
* email (unique)
* password
* role_id

Índices: email, tenant_id

---

### roles

* id
* name

---

### permissions

* id
* name

---

## 🟦 Clínico

### patients

* id
* tenant_id
* name
* document
* birth_date

---

### clinical_records

* id
* patient_id

---

### clinical_encounters

* id
* record_id
* date
* notes

---

### diagnoses

* id
* encounter_id
* description

---

### treatments

* id
* encounter_id
* description

---

### prescriptions

* id
* encounter_id

---

### odontograms

* id
* patient_id

---

### clinical_timeline

* id
* patient_id
* event_type
* reference_id
* date

---

### evolutions

* id
* encounter_id
* notes

---

## 🟦 Órdenes y Resultados

### lab_categories

* id
* name

---

### lab_tests

* id
* category_id
* name

---

### lab_orders

* id
* encounter_id

---

### lab_results

* id
* order_id
* result

---

### imaging_orders

* id
* encounter_id

---

### imaging_results

* id
* order_id
* image_url
* report

---

## 🟦 Inventario (ERP REAL)

### categories

* id
* name

---

### subcategories

* id
* category_id
* name

---

### products

* id
* subcategory_id
* name
* type

---

### warehouses

* id
* tenant_id
* name

---

### sub_warehouses

* id
* warehouse_id
* name

---

### locations

* id
* sub_warehouse_id
* name

---

### stock

* id
* product_id
* location_id
* quantity

Índices: product_id, location_id

---

### stock_minimum

* id
* product_id
* min_quantity

---

### inventory_movements

* id
* product_id
* type
* quantity
* date

---

### kardex_entries

* id
* product_id
* movement_id
* balance

Regla crítica: saldo acumulado obligatorio

---

### transfers

* id
* from_location
* to_location
* product_id
* quantity

---

## 🟦 Patrimonio

### asset_categories

* id
* name

---

### assets

* id
* tenant_id
* category_id
* name
* status

---

### asset_movements

* id
* asset_id
* type
* date

---

### asset_assignments

* id
* asset_id
* employee_id

---

### depreciation

* id
* asset_id
* value
* date

---

## 🟦 RRHH

### employees

* id
* tenant_id
* name
* role

---

### attendance

* id
* employee_id
* date
* status

---

### payroll

* id
* employee_id
* salary
* date

---

### employee_evaluations

* id
* employee_id
* score
* notes

---

### trainings

* id
* employee_id
* name

---

## 🟦 IA

### images

* id
* patient_id
* url

---

### ai_results

* id
* image_id
* diagnosis
* confidence

---

## 10. Validaciones

* no stock negativo
* consistencia kardex
* relaciones obligatorias
* datos clínicos no eliminables

---

## 11. Seguridad

* aislamiento por tenant
* control de acceso por rol
* auditoría implícita

---

## 12. Testing

* TDD para queries críticas
* validación integridad
* pruebas de consistencia

---

## 13. Dependencias técnicas

* PostgreSQL
* pg driver
* Docker

---

## 14. Riesgos técnicos

* inconsistencia kardex
* fuga multi-tenant
* joins complejos
* sobrecarga de consultas

---

## 15. Resultado esperado

* Base de datos robusta
* Escalable
* Sin necesidad de rediseño
* Soporte completo para ERP + clínico

---

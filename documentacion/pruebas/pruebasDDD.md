# Recopilación de pruebas DDD

Este documento consolida las pruebas y validaciones alineadas con **Domain-Driven Design**: reglas de negocio, agregados, integridad del dominio e invariantes, según `documentacion/instrucciones` y evidencias en `documentacion/avance`.

---

## Pilares del proyecto

**`documentacion/reglas/pilares_desarrollo.md`**:

- Dominios de alta complejidad (clínico, inventario, patrimonio) modelados con enfoque DDD.

---

## Fase 2 — SaaS core

**Instrucciones** (`fase_2_saas_core.md`):

- Reglas de negocio SaaS
- Consistencia de estados

---

## Fase 3 — Clínico

**Instrucciones** (`fase_3_clinico.md`):

- Validación de reglas del dominio clínico
- Integridad de relaciones

**Avance** (`avance/fase_3.md`):

- Separación por capas: controllers, services, repositories, domain
- Reglas encapsuladas en servicios clínicos
- Validaciones de integridad entre paciente, historia clínica y consulta
- Soft delete en entidades clínicas donde aplica
- Eventos de dominio en `clinical_timeline` (paciente, consulta, diagnóstico, tratamiento, receta, evolución, odontograma)

---

## Fase 4 — Inventario

**Instrucciones** (`fase_4_inventario.md`):

- Consistencia del dominio inventario

**Avance** (`avance/fase_4.md`):

- No stock negativo
- Todo movimiento genera kardex
- Transferencia atómica origen/destino
- Stock como acumulado de movimientos
- Producto validado por tenant
- Eventos: `product_created`, `stock_updated`, `inventory_entry`, `inventory_exit`, `transfer_completed`

---

## Fase 5 — IA + clínico

**Instrucciones** (`fase_5_ia.md`):

- Validación dominio clínico + IA

**Avance** (`avance/fase_5.md`):

- Imagen asociada a tenant, paciente y encuentro
- Sin resultado IA sin procesamiento previo
- Resultado IA trazable; persistencia en `clinical-service`

---

## Fase 6 — Frontend

**Instrucciones** (`fase_6_frontend.md`):

- Coherencia con dominios backend

---

## Fase 7 — RRHH

**Instrucciones** (`fase_7_rrhh.md`):

- Reglas del dominio organizacional

**Avance** (`avance/fase_7.md`):

- Empleado siempre con tenant
- No asistencia/evaluación/planilla/capacitación sin empleado válido
- Montos de planilla y fechas de asistencia consistentes

---

## Fase 8 — Finanzas

**Instrucciones** (`fase_8_finanzas.md`):

- Reglas del dominio financiero

**Avance** (`avance/fase_8.md`):

- Toda operación genera transacción
- Transacción ligada a cuenta
- Ingreso/egreso por `transactionType`
- No saldo negativo en egresos
- Cash-flow desde transacciones persistidas

---

## Fase 9 — Patrimonio

**Instrucciones** (`fase_9_patrimonio.md`):

- Reglas del dominio patrimonio

**Avance** (`avance/fase_9.md`):

- Activo con tenant y categoría válida
- Una sola asignación activa por activo
- Historial de movimientos
- Depreciación no baja de cero
- Transacciones SQL en operaciones sensibles
- Eventos: `asset_created`, `asset_assigned`, `asset_moved`, `asset_depreciated`

---

## Fase 10 — Agendamiento

**Instrucciones** (`fase_10_agendamiento.md`):

- Reglas del dominio agendamiento

---

## Fase 11 — Servicios externos

**Instrucciones** (`fase_11_servicios_externos.md`):

- Reglas de comunicación

**Avance** (`avance/fase_11.md`):

- Eventos auditables (`email_sent`, `message_sent`)
- Archivos ligados a `tenantId` y lectura restringida
- Fallos externos sin bloquear otros módulos

---

## Fase 12 — Frontend experiencia

**Instrucciones** (`fase_12_frontend_experiencia.md`):

- (Testing DDD implícito vía coherencia con contratos y dominios backend en evolución de UI)

---

## Fase 14 — Seguridad

**Instrucciones** (`fase_14_seguridad_avanzada.md`):

- Reglas de dominio de seguridad

---

## Fase 17 — Trazabilidad y cumplimiento

**Avance** (`avance/fase_17.md`):

- Trazabilidad vía `audit_logs` y `access_logs`
- Evidencia en `/health` y `/metrics`
- Observabilidad y trazabilidad con `x-trace-id`

---

## Referencias

- Modelo clínico y DDD obligatorio: `documentacion/instrucciones/fase_3_clinico.md`
- Registro de reglas por fase: `documentacion/avance/fase_*.md`

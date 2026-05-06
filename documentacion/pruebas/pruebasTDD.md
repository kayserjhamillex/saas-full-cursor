# Recopilación de pruebas TDD

Este documento consolida las pruebas orientadas a **Test-Driven Development** definidas en `documentacion/instrucciones` y las verificaciones técnicas registradas en `documentacion/avance` (compilación, contratos HTTP, casos de servicio y regresión puntual).

---

## Fase 1 — Arquitectura base

**Instrucciones** (`fase_1_arquitectura_base.md`):

- TDD en autenticación
- Pruebas de integración

**Avance** (`avance/fase_1.md`):

- Compilación TypeScript: `auth-service`, `core-service`, `api-gateway`

---

## Fase 2 — SaaS core

**Instrucciones** (`fase_2_saas_core.md`):

- Creación de tenant
- Activación/desactivación de suscripción
- Registro de pagos

**Avance** (`avance/fase_2.md`):

- `pnpm build` en `core-service` y `api-gateway`
- Linter sin errores en archivos modificados

---

## Fase 3 — Clínico

**Instrucciones** (`fase_3_clinico.md`):

- Registro de paciente
- Creación de consulta
- Registro de diagnóstico

**Avance** (`avance/fase_3.md`):

- Compilación local de `clinical-service` y `api-gateway`

---

## Fase 4 — Inventario

**Instrucciones** (`fase_4_inventario.md`):

- Movimientos de inventario
- Cálculo de stock
- Generación de kardex

**Avance** (`avance/fase_4.md`):

- Compilación en `inventory-service` y `api-gateway`

---

## Fase 5 — IA

**Instrucciones** (`fase_5_ia.md`):

- Procesamiento de imagen
- Generación de resultados

**Avance** (`avance/fase_5.md`):

- Compilación en `clinical-service` y `api-gateway`
- Estructura de `ai-service`: endpoints `/health` y `/ai/predictions/process`

---

## Fase 7 — RRHH

**Instrucciones** (`fase_7_rrhh.md`):

- Registro de empleados
- Asistencia
- Planilla

**Avance** (`avance/fase_7.md`):

- Compilación de `hr-service` y `api-gateway`
- Verificación de endpoints y payloads documentados

---

## Fase 8 — Finanzas

**Instrucciones** (`fase_8_finanzas.md`):

- Creación de transacciones
- Cálculo de flujo

**Avance** (`avance/fase_8.md`):

- Creación de cuenta financiera
- Registro de ingreso
- Registro de egreso con saldo suficiente
- Rechazo por saldo insuficiente
- Listado de cuentas y transacciones
- Reporte de cash-flow

---

## Fase 9 — Patrimonio

**Instrucciones** (`fase_9_patrimonio.md`):

- Registro de activos
- Asignaciones
- Depreciación

**Avance** (`avance/fase_9.md`):

- Registro de activo con categoría válida
- Rechazo con categoría inexistente
- Asignación de activo a empleado del tenant
- Rechazo por activo ya asignado
- Movimiento de mantenimiento y actualización de estado
- Depreciación mensual con actualización de valor

---

## Fase 10 — Agendamiento

**Instrucciones** (`fase_10_agendamiento.md`):

- Creación de citas
- Validación de disponibilidad

---

## Fase 11 — Servicios externos

**Instrucciones** (`fase_11_servicios_externos.md`):

- Envío de email
- Envío de mensajes
- Carga de archivos

**Avance** (`avance/fase_11.md`):

- `POST /gateway/notifications/email`
- `POST /gateway/notifications/whatsapp`
- `POST /gateway/files/upload`
- `GET /gateway/files/:fileId?tenantId=...`
- Validaciones de entrada por servicio

---

## Fase 12 — Frontend (build / contrato)

**Avance** (`avance/fase_12.md`):

- Build: `demo-app`, `react-app`, `angular-app`

---

## Fase 14 — Seguridad avanzada

**Instrucciones** (`fase_14_seguridad_avanzada.md`):

- Validación de tokens
- Control de acceso

---

## Fase 15 — Observabilidad

**Avance** (`avance/fase_15.md`):

- Endpoints `/health` y `/metrics` en servicios
- Targets de Prometheus
- Emisión de `x-trace-id` y logs estructurados

---

## Fase 16 — Escalabilidad / colas

**Avance** (`avance/fase_16.md`):

- Flujo de encolado en `email-service`
- No regresión en contrato de respuesta del envío de email (`status: queued`)

---

## Fase 17 — Calidad / cumplimiento

**Avance** (`avance/fase_17.md`):

- Pruebas de seguridad: 401 / 403 / 429 y revocación de sesiones

---

## Referencias cruzadas

- Flujos manuales detallados por módulo: `documentacion/manualdeusuario.md`
- Integración gateway ↔ servicios: sección «Integración» en cada fase de instrucciones donde aplica

# Fase 8 — Finanzas, Economía y Control Contable

---

1. Descripción de la fase

Esta fase implementa el módulo financiero del sistema SaaS clínico, permitiendo la gestión de ingresos, egresos, cuentas, flujo de caja y control económico de cada tenant.

El objetivo es centralizar toda la información financiera generada por los distintos módulos (SaaS, inventario, RRHH, clínico), garantizando consistencia contable, trazabilidad y soporte para la toma de decisiones.

Esta fase depende de:

* /documentacion/reglas
* /documentacion/database
* Fase 2 (SaaS)
* Fase 4 (Inventario)
* Fase 7 (RRHH)

---

2. Objetivo técnico

Implementar un sistema financiero que permita:

* Registro de ingresos y egresos
* Gestión de cuentas financieras
* Control de flujo de caja
* Registro de transacciones
* Generación de reportes financieros
* Integración con otros módulos del sistema

---

3. Carpetas involucradas

/apps/financial-service
/apps/api-gateway
/documentacion/reglas
/documentacion/database
/documentacion/avance

---

4. Responsabilidades por carpeta

/apps/financial-service

* Gestión de cuentas
* Registro de ingresos y egresos
* Control de transacciones
* Gestión de flujo de caja
* Generación de reportes

/apps/api-gateway

* Validación de acceso
* Enrutamiento

/documentacion/reglas

* Reglas contables y de integridad

/documentacion/database

* Tablas:

  * financial_accounts
  * transactions
  * transaction_details

/documentacion/avance

* Registro del progreso técnico

---

5. Flujo de datos

Registro de ingreso

1. Se registra ingreso (consulta, pago, venta)
2. Se crea transacción
3. Se actualiza cuenta
4. Se refleja en flujo de caja

---

Registro de egreso

1. Se registra gasto (inventario, RRHH, activos)
2. Se crea transacción
3. Se actualiza cuenta
4. Se registra salida en flujo

---

Consulta financiera

1. Se consultan transacciones
2. Se generan reportes
3. Se presentan datos al usuario

---

6. Interacción entre microservicios

* api-gateway → financial-service
* inventory-service → financial-service (egresos)
* hr-service → financial-service (planillas)
* core-service → financial-service (pagos SaaS)

Reglas:

* No acceso directo a base de datos de otros servicios
* Integración mediante eventos o APIs

---

7. Eventos (event-driven)

Eventos definidos:

* income_registered
* expense_registered
* transaction_created
* report_generated

Uso:

* auditoría
* sincronización
* monitoreo

---

8. Estructura lógica interna

/financial-service

* controllers:

  * account.controller
  * transaction.controller
  * report.controller

* services:

  * account.service
  * transaction.service
  * report.service

* repositories:

  * account.repository
  * transaction.repository

* domain:

  * account.entity
  * transaction.entity

---

9. Reglas de negocio

* Toda operación financiera genera una transacción
* No se permiten inconsistencias contables
* Toda transacción debe estar asociada a una cuenta
* Ingresos y egresos deben estar diferenciados
* Flujo de caja debe ser consistente

---

10. Validaciones

* cuenta existente
* monto válido
* tipo de transacción correcto
* integridad de datos
* consistencia contable

---

11. Seguridad

* Validación JWT
* Validación tenant
* Control de acceso a datos financieros
* Protección de información sensible

---

12. Testing (TDD / BDD / DDD)

TDD

* creación de transacciones
* cálculo de flujo

Integración

* interacción con inventario y RRHH

DDD

* reglas del dominio financiero

---

13. Dependencias técnicas

* NestJS
* PostgreSQL
* Docker

---

14. Riesgos técnicos

* inconsistencias contables
* errores en cálculos financieros
* duplicación de transacciones
* pérdida de integridad

---

15. Resultado esperado

* Sistema financiero funcional
* Control completo de ingresos y egresos
* Integración con módulos del sistema
* Base para reportes financieros
* Soporte para toma de decisiones

---

16. Registro de avance (documentacion/avance)

Se debe generar:

/documentacion/avance/fase_8.md

Contenido:

* Fecha de implementación
* Servicios implementados:

  * financial-service
* Funcionalidades completadas:

  * cuentas
  * ingresos
  * egresos
  * transacciones
  * flujo de caja
* Integración con otros módulos validada
* Reglas aplicadas
* Pruebas ejecutadas
* Problemas encontrados
* Decisiones técnicas

---

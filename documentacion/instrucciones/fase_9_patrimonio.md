# Fase 9 — Gestión de Patrimonio y Activos

---

1. Descripción de la fase

Esta fase implementa el módulo de patrimonio, encargado de la gestión de activos fijos dentro de cada tenant (clínica), tales como equipos odontológicos, mobiliario y otros bienes.

Permite controlar el ciclo de vida de los activos, su asignación, movimientos, estado y depreciación, garantizando trazabilidad completa y control administrativo.

Este módulo complementa al sistema ERP junto con inventario, RRHH y finanzas.

Depende de:

* /documentacion/reglas
* /documentacion/database
* Fase 4 (Inventario)
* Fase 7 (RRHH)
* Fase 8 (Finanzas)

---

2. Objetivo técnico

Implementar un sistema de gestión de activos que permita:

* Registro de activos
* Clasificación por categorías
* Asignación a empleados o áreas
* Registro de movimientos de activos
* Control de estado del activo
* Cálculo de depreciación
* Integración con finanzas

---

3. Carpetas involucradas

/apps/assets-service
/apps/api-gateway
/apps/hr-service
/apps/financial-service
/documentacion/reglas
/documentacion/database
/documentacion/avance

---

4. Responsabilidades por carpeta

/apps/assets-service

* Gestión de activos
* Registro de movimientos
* Asignación de activos
* Control de estado
* Cálculo de depreciación

/apps/api-gateway

* Validación de acceso
* Enrutamiento

/apps/hr-service

* Validación de empleados
* Asociación de activos a personal

/apps/financial-service

* Registro de depreciación
* Impacto financiero

/documentacion/reglas

* Reglas de consistencia y arquitectura

/documentacion/database

* Tablas:

  * assets
  * asset_categories
  * asset_movements
  * asset_assignments
  * depreciation

/documentacion/avance

* Registro del progreso técnico

---

5. Flujo de datos

Registro de activo

1. Se registra un activo
2. Se asigna categoría
3. Se almacena en base de datos

---

Asignación de activo

1. Se asigna activo a empleado
2. Se registra en asset_assignments
3. Se valida existencia del empleado

---

Movimiento de activo

1. Se registra movimiento (traslado, mantenimiento, baja)
2. Se actualiza estado
3. Se almacena en historial

---

Depreciación

1. Se calcula depreciación
2. Se registra en sistema financiero
3. Se actualiza valor del activo

---

6. Interacción entre microservicios

* api-gateway → assets-service
* assets-service → hr-service
* assets-service → financial-service

Reglas:

* No acceso directo a DB de otros servicios
* Validaciones mediante APIs

---

7. Eventos (event-driven)

Eventos definidos:

* asset_created
* asset_assigned
* asset_moved
* asset_depreciated

Uso:

* auditoría
* integración con finanzas
* monitoreo

---

8. Estructura lógica interna

/assets-service

* controllers:

  * asset.controller
  * movement.controller
  * assignment.controller

* services:

  * asset.service
  * movement.service
  * assignment.service
  * depreciation.service

* repositories:

  * asset.repository
  * movement.repository

* domain:

  * asset.entity
  * movement.entity
  * assignment.entity

---

9. Reglas de negocio

* Todo activo debe pertenecer a un tenant
* Todo activo debe tener categoría
* Un activo puede estar asignado a un solo empleado a la vez
* Todo movimiento debe registrarse
* La depreciación debe ser consistente con reglas financieras

---

10. Validaciones

* activo existente
* empleado válido
* categoría válida
* integridad de movimientos
* consistencia de depreciación

---

11. Seguridad

* Validación JWT
* Validación tenant
* Control de acceso por roles
* Protección de datos

---

12. Testing (TDD / BDD / DDD)

TDD

* registro de activos
* asignaciones
* depreciación

Integración

* interacción con RRHH y finanzas

DDD

* reglas del dominio patrimonio

---

13. Dependencias técnicas

* NestJS
* PostgreSQL
* Docker

---

14. Riesgos técnicos

* inconsistencias en asignaciones
* errores en depreciación
* pérdida de trazabilidad
* conflictos con RRHH

---

15. Resultado esperado

* Sistema de patrimonio funcional
* Control total de activos
* Integración con RRHH y finanzas
* Trazabilidad completa
* Base ERP completa

---

16. Registro de avance (documentacion/avance)

Se debe generar:

/documentacion/avance/fase_9.md

Contenido:

* Fecha de implementación
* Servicios implementados:

  * assets-service
* Funcionalidades completadas:

  * registro de activos
  * asignaciones
  * movimientos
  * depreciación
* Integración con otros servicios validada
* Reglas aplicadas
* Pruebas ejecutadas
* Problemas encontrados
* Decisiones técnicas

---

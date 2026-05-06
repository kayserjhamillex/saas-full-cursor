# Fase 7 — Gestión de Recursos Humanos (RRHH)

---

1. Descripción de la fase

Esta fase implementa el módulo de Recursos Humanos, encargado de la gestión integral del personal dentro de cada tenant (clínica). Incluye el registro de empleados, control de asistencia, evaluaciones de desempeño, capacitación y gestión de planillas.

Se integra con los módulos clínico, inventario y SaaS para asegurar coherencia organizacional y control operativo del personal.

Depende de:

* /documentacion/reglas
* /documentacion/database
* Fase 1 (seguridad)
* Fase 2 (SaaS)
* Fase 3 (clínico, para personal médico)

---

2. Objetivo técnico

Implementar un sistema de RRHH que permita:

* Registro y gestión de empleados
* Control de asistencia
* Evaluación de desempeño
* Gestión de capacitaciones
* Gestión de planillas (payroll)
* Asociación de empleados a roles y funciones

---

3. Carpetas involucradas

/apps/hr-service
/apps/api-gateway
/documentacion/reglas
/documentacion/database
/documentacion/avance

---

4. Responsabilidades por carpeta

/apps/hr-service

* Gestión de empleados
* Control de asistencia
* Evaluaciones
* Gestión de planillas
* Gestión de capacitaciones

/apps/api-gateway

* Validación de acceso
* Enrutamiento

/documentacion/reglas

* Reglas de arquitectura y validación

/documentacion/database

* Tablas:

  * employees
  * attendance
  * payroll
  * employee_evaluations
  * trainings

/documentacion/avance

* Registro del progreso técnico

---

5. Flujo de datos

Registro de empleado

1. Usuario autorizado registra empleado
2. Gateway valida acceso
3. hr-service almacena información

---

Control de asistencia

1. Se registra entrada/salida
2. Se guarda en tabla attendance
3. Se valida consistencia

---

Evaluación de desempeño

1. Se registra evaluación
2. Se asocia a empleado
3. Se almacena resultado

---

Gestión de planilla

1. Se genera registro de pago
2. Se asocia a empleado
3. Se registra en payroll

---

6. Interacción entre microservicios

* api-gateway → hr-service

Opcional:

* hr-service → clinical-service (validación de personal médico)

Reglas:

* No acceso directo a otros dominios
* Validación previa en gateway

---

7. Eventos (event-driven)

Eventos definidos:

* employee_created
* attendance_registered
* evaluation_completed
* payroll_generated

Uso:

* auditoría
* reportes
* monitoreo

---

8. Estructura lógica interna

/hr-service

* controllers:

  * employee.controller
  * attendance.controller
  * evaluation.controller
  * payroll.controller

* services:

  * employee.service
  * attendance.service
  * evaluation.service
  * payroll.service

* repositories:

  * employee.repository
  * attendance.repository
  * payroll.repository

* domain:

  * employee.entity
  * evaluation.entity
  * payroll.entity

---

9. Reglas de negocio

* Todo empleado pertenece a un tenant
* No se puede registrar asistencia sin empleado
* Evaluaciones deben estar asociadas a empleados
* Planilla depende de registros válidos
* Roles determinan funciones dentro del sistema

---

10. Validaciones

* empleado existente
* datos de asistencia válidos
* consistencia de evaluaciones
* integridad de planilla

---

11. Seguridad

* Validación JWT
* Validación tenant
* Control de acceso por roles
* Protección de datos del personal

---

12. Testing (TDD / BDD / DDD)

TDD

* registro de empleados
* asistencia
* planilla

Integración

* flujo completo RRHH

DDD

* reglas del dominio organizacional

---

13. Dependencias técnicas

* NestJS
* PostgreSQL
* Docker

---

14. Riesgos técnicos

* inconsistencias en asistencia
* errores en planilla
* mala gestión de evaluaciones
* acceso indebido a datos

---

15. Resultado esperado

* Sistema de RRHH funcional
* Control de empleados completo
* Evaluaciones y asistencia operativas
* Integración con sistema SaaS
* Base para gestión organizacional

---

16. Registro de avance (documentacion/avance)

Se debe generar:

/documentacion/avance/fase_7.md

Contenido:

* Fecha de implementación
* Servicios implementados:

  * hr-service
* Funcionalidades completadas:

  * empleados
  * asistencia
  * evaluaciones
  * planilla
  * capacitaciones
* Integración con API Gateway validada
* Integración con base de datos validada
* Reglas aplicadas
* Pruebas ejecutadas
* Problemas encontrados
* Decisiones técnicas

---

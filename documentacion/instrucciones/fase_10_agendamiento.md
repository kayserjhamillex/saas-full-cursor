# fase_10_agendamiento.md

Fase 10 — Agendamiento, Gestión de Citas y Disponibilidad

---

1. Descripción de la fase

Esta fase implementa el módulo de agendamiento, encargado de la gestión completa de citas dentro del sistema clínico odontológico.

Permite administrar la disponibilidad de profesionales, creación de citas, reprogramaciones, cancelaciones y control de estados, garantizando coherencia operativa entre pacientes, personal médico y recursos.

Este módulo es crítico porque conecta directamente:

* dominio clínico
* RRHH
* frontend
* notificaciones

Depende de:

* /documentacion/reglas
* /documentacion/database
* Fase 1 (seguridad)
* Fase 3 (clínico)
* Fase 7 (RRHH)

---

2. Objetivo técnico

Implementar un sistema de agendamiento que permita:

* Gestión de citas (appointments)
* Configuración de horarios de profesionales
* Control de disponibilidad
* Creación, actualización y cancelación de citas
* Reprogramación de citas
* Control de estados (pendiente, confirmada, atendida, cancelada)
* Integración con pacientes y empleados
* Integración con notificaciones

---

3. Carpetas involucradas

/apps/scheduling-service
/apps/api-gateway
/apps/clinical-service
/apps/hr-service
/services/email-service
/services/whatsapp-service
/documentacion/reglas
/documentacion/database
/documentacion/avance

---

4. Responsabilidades por carpeta

/apps/scheduling-service

* Gestión de citas
* Control de horarios
* Validación de disponibilidad
* Gestión de estados
* Reprogramaciones

/apps/api-gateway

* Validación de acceso
* Enrutamiento

/apps/clinical-service

* Validación de pacientes
* Asociación de citas a historia clínica

/apps/hr-service

* Validación de profesionales
* Gestión de disponibilidad laboral

/services/email-service

* Envío de recordatorios

/services/whatsapp-service

* Notificaciones de citas

/documentacion/reglas

* Reglas de negocio del agendamiento

/documentacion/database

* Tablas esperadas:

  * appointments
  * schedules
  * availability
  * appointment_status

/documentacion/avance

* Registro del progreso técnico

---

5. Flujo de datos

Creación de cita

1. Usuario solicita cita
2. Se valida paciente
3. Se valida profesional
4. Se consulta disponibilidad
5. Se registra cita
6. Se envía notificación

---

Reprogramación

1. Usuario solicita cambio
2. Se valida nueva disponibilidad
3. Se actualiza cita
4. Se notifica

---

Cancelación

1. Usuario cancela cita
2. Se actualiza estado
3. Se libera espacio
4. Se notifica

---

Atención

1. Cita pasa a estado atendida
2. Se registra en sistema clínico

---

6. Interacción entre microservicios

* api-gateway → scheduling-service
* scheduling-service → clinical-service
* scheduling-service → hr-service
* scheduling-service → servicios de notificación

Reglas:

* No acceso directo a bases de datos externas
* Validaciones mediante APIs

---

7. Eventos (event-driven)

Eventos definidos:

* appointment_created
* appointment_rescheduled
* appointment_cancelled
* appointment_completed

Uso:

* notificaciones
* auditoría
* sincronización

---

8. Estructura lógica interna

/scheduling-service

* controllers:

  * appointment.controller
  * schedule.controller

* services:

  * appointment.service
  * availability.service
  * schedule.service

* repositories:

  * appointment.repository
  * schedule.repository

* domain:

  * appointment.entity
  * schedule.entity
  * availability.entity

---

9. Reglas de negocio

* No se puede crear cita sin disponibilidad
* Un profesional no puede tener citas superpuestas
* Toda cita debe estar asociada a paciente y profesional
* Cambios de estado deben ser controlados
* Cancelaciones deben registrarse

---

10. Validaciones

* paciente válido
* profesional válido
* disponibilidad correcta
* integridad de datos
* coherencia de horarios

---

11. Seguridad

* Validación JWT
* Validación tenant
* Control de acceso por roles
* Protección de datos

---

12. Testing (TDD / BDD / DDD)

TDD

* creación de citas
* validación de disponibilidad

Integración

* flujo completo de agendamiento

BDD

* experiencia de usuario (flujo de citas)

DDD

* reglas del dominio agendamiento

---

13. Dependencias técnicas

* NestJS
* PostgreSQL
* Docker

---

14. Riesgos técnicos

* solapamiento de citas
* errores de disponibilidad
* fallos en notificaciones
* inconsistencias con RRHH

---

15. Resultado esperado

* Sistema de agendamiento funcional
* Control completo de citas
* Integración con clínico y RRHH
* Notificaciones operativas
* Base lista para frontend completo

---

16. Registro de avance (documentacion/avance)

Se debe generar:

/documentacion/avance/fase_10.md

Contenido:

* Fecha de implementación
* Servicios implementados:

  * scheduling-service
* Funcionalidades completadas:

  * citas
  * horarios
  * disponibilidad
  * estados
* Integración con otros servicios validada
* Reglas aplicadas
* Pruebas ejecutadas
* Problemas encontrados
* Decisiones técnicas

---

17. Plan de ejecucion sugerido (implementacion incremental)

Orden recomendado para desarrollar la fase 10 sin romper integraciones:

1) Base de datos y migraciones

* Crear tablas `schedules`, `availability`, `appointments`.
* Definir indices por `tenant_id`, `professional_id`, `start_at`.
* Agregar restriccion para evitar duplicidad exacta de cita por profesional y bloque horario.

2) Dominio y reglas internas

* Implementar entidades y value objects de agendamiento.
* Modelar maquina de estados de cita: `pending`, `confirmed`, `attended`, `cancelled`.
* Centralizar regla de no solapamiento en `availability.service`.

3) Endpoints principales

* CRUD de horarios de profesional.
* Crear cita, reprogramar cita, cancelar cita y cambiar estado de atencion.
* Consulta de disponibilidad por profesional y rango de fechas.

4) Integraciones

* Validacion de paciente contra `clinical-service`.
* Validacion de profesional contra `hr-service`.
* Emision de eventos para notificaciones y auditoria.

5) Calidad y cierre

* Pruebas unitarias de disponibilidad y transiciones de estado.
* Pruebas de integracion del flujo completo de cita.
* Registro de resultados y decisiones en `documentacion/avance/fase_10.md`.

---

18. Criterios de aceptacion minimos

La fase se considera completa cuando:

* No se pueden crear citas solapadas para un mismo profesional.
* Toda cita exige `tenant_id`, `patient_id`, `professional_id`, fecha/hora y estado valido.
* Reprogramar libera bloque anterior y ocupa nuevo bloque.
* Cancelar actualiza estado y libera disponibilidad.
* Atender cita deja rastro para historia clinica/eventos.
* Todos los endpoints validan JWT, tenant y permisos de rol.

---

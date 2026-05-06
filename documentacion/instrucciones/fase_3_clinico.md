#Fase 3 — Dominio Clínico, Historia Clínica y Gestión de Atención

---

1. Descripción de la fase

Esta fase implementa el dominio clínico del sistema SaaS odontológico, incluyendo la gestión de pacientes, historia clínica, consultas, diagnósticos, tratamientos, recetas, odontograma y cronología clínica.

Se estructura bajo principios de **Domain-Driven Design (DDD)** debido a la complejidad del dominio, asegurando coherencia en las reglas médicas y trazabilidad completa del paciente.

Esta fase depende estrictamente de:

* /documentacion/reglas
* /documentacion/database
* Fase 1 (autenticación y control de acceso)
* Fase 2 (validación SaaS y módulos activos)

---

2. Objetivo técnico

Implementar el dominio clínico permitiendo:

* Registro y gestión de pacientes
* Creación de historia clínica
* Registro de consultas (encounters)
* Diagnósticos y tratamientos
* Generación de recetas
* Gestión de odontograma
* Registro de evolución clínica
* Cronología completa del paciente
* Integración con órdenes de laboratorio e imágenes

---

3. Carpetas involucradas

/apps/clinical-service
/apps/api-gateway
/documentacion/reglas
/documentacion/database
/documentacion/avance

---

4. Responsabilidades por carpeta

/apps/clinical-service

* Gestión de pacientes
* Gestión de historia clínica
* Registro de consultas
* Diagnósticos y tratamientos
* Recetas médicas
* Odontograma
* Evoluciones
* Cronología clínica

/apps/api-gateway

* Validación de acceso (JWT + tenant + SaaS)
* Enrutamiento hacia clinical-service

/documentacion/reglas

* Aplicación de DDD
* Validaciones clínicas
* Estructura por capas

/documentacion/database

* Tablas:

  * patients
  * clinical_records
  * clinical_encounters
  * diagnoses
  * treatments
  * prescriptions
  * odontograms
  * clinical_timeline
  * evolutions

/documentacion/avance

* Registro del progreso técnico

---

5. Flujo de datos

Registro de paciente

1. Usuario autenticado realiza registro
2. Gateway valida acceso
3. clinical-service registra paciente
4. Se crea historia clínica asociada

---

Consulta clínica

1. Se crea clinical_encounter
2. Se registran:

   * diagnósticos
   * tratamientos
3. Se generan recetas si aplica
4. Se registra en cronología

---

Evolución clínica

1. Se registra evolución
2. Se vincula a consulta
3. Se actualiza historial

---

Odontograma

1. Se registra estado dental
2. Se actualiza por consulta
3. Se mantiene histórico

---

6. Interacción entre microservicios

* api-gateway → clinical-service
* clinical-service → core-service (validación tenant si aplica)

Reglas:

* No acceso directo a otros dominios
* Validación previa en gateway

---

7. Eventos (event-driven)

Eventos definidos:

* patient_created
* clinical_record_created
* encounter_created
* diagnosis_registered
* treatment_assigned
* prescription_created

Uso:

* auditoría
* integración futura con IA
* notificaciones

---

8. Estructura lógica interna

/clinical-service

* controllers:

  * patient.controller
  * clinical.controller
  * odontogram.controller

* services:

  * patient.service
  * clinical.service
  * diagnosis.service
  * treatment.service

* repositories:

  * patient.repository
  * clinical.repository

* domain:

  * patient.entity
  * clinical_record.entity
  * encounter.entity
  * diagnosis.entity

DDD obligatorio:

* separación de agregados
* reglas encapsuladas en dominio

---

9. Reglas de negocio

* Todo paciente debe tener historia clínica
* No se puede registrar consulta sin paciente
* Diagnósticos dependen de una consulta
* Tratamientos dependen de diagnóstico
* Toda acción debe registrarse en cronología
* No se eliminan datos clínicos (solo soft delete)

---

10. Validaciones

* paciente existente
* integridad de historia clínica
* consistencia de consultas
* validación de datos médicos
* cumplimiento de estructura de base de datos

---

11. Seguridad

* Validación JWT obligatoria
* Validación tenant
* Restricción de acceso a datos clínicos
* Protección de datos sensibles

---

12. Testing (TDD / BDD / DDD)

TDD

* registro de paciente
* creación de consulta
* registro de diagnóstico

BDD

* flujo completo de atención clínica

DDD

* validación de reglas del dominio clínico
* integridad de relaciones

---

13. Dependencias técnicas

* NestJS
* PostgreSQL
* API Gateway
* Docker

---

14. Riesgos técnicos

* inconsistencias en historia clínica
* pérdida de trazabilidad
* errores en relaciones clínicas
* manejo incorrecto del dominio

---

15. Resultado esperado

* Sistema clínico completamente funcional
* Historia clínica estructurada
* Trazabilidad total del paciente
* Integración con arquitectura base
* Base lista para integración con IA y ERP

---

16. Registro de avance (documentacion/avance)

Se debe generar:

/documentacion/avance/fase_3.md

Contenido:

* Fecha de implementación
* Servicios implementados:

  * clinical-service
* Funcionalidades completadas:

  * gestión de pacientes
  * historia clínica
  * consultas
  * diagnósticos
  * tratamientos
  * recetas
  * odontograma
  * cronología
* Integración con API Gateway validada
* Integración con base de datos validada
* Reglas de desarrollo aplicadas (DDD)
* Pruebas ejecutadas
* Problemas encontrados (si aplica)
* Decisiones técnicas tomadas

---

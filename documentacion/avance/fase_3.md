# AVANCE — FASE 3 CLINICO

## Fecha de implementacion

2026-04-21

## Servicios implementados

- `clinical-service`

## Funcionalidades completadas

- Gestion de pacientes (`patients`) con creacion automatica de historia clinica.
- Gestion de historia clinica (`clinical_records`) asociada a cada paciente.
- Registro de consultas (`clinical_encounters`).
- Registro de diagnosticos (`diagnoses`).
- Asignacion de tratamientos (`treatments`).
- Generacion de recetas (`prescriptions`).
- Gestion de odontograma (`odontograms`) con actualizacion por paciente.
- Cronologia clinica (`clinical_timeline`) para trazabilidad completa.
- Registro de evoluciones (`evolutions`).

## Integracion con API Gateway validada

Se agregaron rutas en `api-gateway` para el dominio clinico:

- `POST /gateway/clinical/patients`
- `POST /gateway/clinical/records/encounters`
- `POST /gateway/clinical/records/diagnoses`
- `POST /gateway/clinical/records/treatments`
- `POST /gateway/clinical/records/prescriptions`
- `POST /gateway/clinical/records/evolutions`
- `POST /gateway/clinical/odontograms`
- `GET /gateway/clinical/records/timeline/:patientId`

Todas pasan por validacion previa de:

- JWT (`Authorization: Bearer ...`)
- consistencia tenant (`x-tenant-id`)
- validacion SaaS del modulo `clinical` en `core-service`

## Integracion con base de datos validada

El `clinical-service` implementa persistencia para las tablas:

- `patients`
- `clinical_records`
- `clinical_encounters`
- `diagnoses`
- `treatments`
- `prescriptions`
- `odontograms`
- `clinical_timeline`
- `evolutions`

## Reglas de desarrollo aplicadas (DDD)

- Separacion por capas: `controllers`, `services`, `repositories`, `domain`.
- Reglas del dominio encapsuladas en servicios clinicos.
- Validaciones de integridad entre paciente, historia clinica y consulta.
- No se contempla borrado fisico en entidades clinicas; se respeta enfoque de soft delete en tablas que lo soportan.

## Pruebas ejecutadas

- Verificacion de compilacion local de `clinical-service` y `api-gateway`.
- Definicion de flujo de pruebas funcionales en `documentacion/manualdeusuario.md`:
  - alta de paciente
  - alta de consulta
  - diagnostico
  - tratamiento
  - receta
  - evolucion
  - odontograma
  - consulta de cronologia

## Problemas encontrados

- No aplica en esta iteracion.

## Decisiones tecnicas tomadas

- Se fijo prefijo global `clinical` y puerto por defecto `3003` para aislar el microservicio clinico.
- Se centralizo la trazabilidad clinica en `clinical_timeline` mediante eventos de dominio:
  - `patient_created`
  - `clinical_record_created`
  - `encounter_created`
  - `diagnosis_registered`
  - `treatment_assigned`
  - `prescription_created`
  - `evolution_registered`
  - `odontogram_updated`
- Se mantuvo la validacion de acceso en `api-gateway` para evitar logica de seguridad distribuida en controladores clinicos.

# AVANCE — FASE 5 IA

## Fecha de implementacion

2026-04-21

## Servicios implementados

- `ai-service`
- Integracion de IA en `clinical-service`
- Exposicion de rutas IA en `api-gateway`

## Funcionalidades completadas

- Carga de imagen clinica en flujo de consulta (`images`).
- Procesamiento de imagen en `ai-service` mediante endpoint FastAPI.
- Generacion de resultado estructurado de IA (`ai_results`) con riesgo y recomendaciones.
- Persistencia de resultados IA vinculados a `encounter`.
- Registro de eventos de cronologia: `image_uploaded`, `image_processed`, `ai_result_generated`.
- Consulta de resultados IA por paciente.

## Integracion con base de datos validada

Se definieron las tablas para Fase 5:

- `images`
- `ai_results`

Y su relacion con:

- `patients`
- `clinical_encounters`

## Reglas aplicadas

- Toda imagen queda asociada a `tenant`, `patient` y `encounter`.
- No se genera resultado IA sin procesamiento previo.
- El resultado IA se registra como soporte clinico y trazable.
- La persistencia centralizada ocurre en `clinical-service` (IA desacoplada de la DB principal).

## Pruebas ejecutadas

- Verificacion de compilacion en `clinical-service` y `api-gateway`.
- Validacion de estructura de `ai-service` con endpoint `/health` y `/ai/predictions/process`.
- Definicion del flujo funcional Fase 5 en `documentacion/manualdeusuario.md`.

## Problemas encontrados

- El comando `python` no esta disponible directamente en PATH del entorno shell, por lo que la ejecucion debe hacerse via `venv\Scripts\activate` + `uvicorn`.

## Decisiones tecnicas

- Se implemento `ai-service` desacoplado con FastAPI y contrato HTTP JSON simple para facilitar integracion incremental.
- `clinical-service` mantiene la persistencia de `images` y `ai_results` para respetar separacion de responsabilidades.
- `api-gateway` aplica validacion JWT + tenant antes de enrutar endpoints de IA del dominio clinico.

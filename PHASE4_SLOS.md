# Phase 4 - SLOs Operativos Iniciales

Este documento define una base minima de SLO para comenzar la fase de escalabilidad
y performance con objetivos medibles y accionables por servicio.

## 1) Disponibilidad HTTP por servicio

- **Indicador (SLI)**: porcentaje de respuestas `2xx|3xx` sobre total de requests.
- **Objetivo (SLO)**: `>= 99.5%` por ventana movil de 30 dias.
- **Aplica a**: `api-gateway`, `auth-service`, `core-service`, `clinical-service`,
  `inventory-service`, `scheduling-service`, `hr-service`, `financial-service`,
  `assets-service`, `email-service`, `whatsapp-service`, `file-service`.

## 2) Latencia de borde en API Gateway

- **SLI**: p95 de latencia de requests en `api-gateway`.
- **SLO**: p95 `< 350ms` en horario normal y p95 `< 600ms` en picos.
- **Error budget mensual**: 0.5% de requests pueden quedar fuera de objetivo.

## 3) Salud de dependencias internas

- **SLI**: porcentaje de llamadas internas del gateway con timeout o error 5xx.
- **SLO**: `< 1.5%` de errores internos por servicio aguas abajo.
- **Objetivo de recuperacion**: MTTR `< 30 min` en incidentes Sev-2.

## 4) Entrega de notificaciones

- **SLI**: porcentaje de notificaciones aceptadas por servicio y procesadas sin error definitivo.
- **SLO**: `>= 99.0%` de procesamiento exitoso por ventana de 7 dias.
- **Nota**: en esta iteracion se elimina estado de cola en memoria para reducir riesgo
  de perdida por reinicios; siguiente paso recomendado es broker durable (RabbitMQ).

## 5) Integridad de metadata de archivos

- **SLI**: porcentaje de lecturas de metadata que encuentran registros existentes tras reinicio.
- **SLO**: `100%` de consistencia de metadata persistida.
- **Nota**: se migro de memoria a almacenamiento en disco para metadata.

## Definition of Done de esta base SLO

- Existe contrato de SLO documentado y versionado en repositorio.
- Todos los servicios exponen `/health` y `/metrics`.
- Equipo acuerda umbrales de alertas iniciales alineados con estos SLO.
- Las proximas historias deben referenciar el SLO impactado.

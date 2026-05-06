# Avance Fase 16 - Escalabilidad, Rendimiento y Optimizacion

Fecha: 2026-04-21

## Estrategias de escalabilidad aplicadas

- Se incorporo base de escalamiento horizontal en `docker/docker-compose.yml` para Redis y RabbitMQ.
- Se mantuvo separacion de redes y healthchecks para mejorar disponibilidad y tolerancia a fallos.
- Se parametrizaron controles de concurrencia y reintentos por entorno (`development`, `staging`, `production`).

## Cache implementado

- Se implemento cache TTL en `apps/api-gateway/src/app.service.ts` para validaciones de tenant/modulo.
- La cache evita llamadas repetidas a `core-service` durante la ventana de TTL.
- Variables de control incorporadas:
  - `ENABLE_TENANT_CACHE`
  - `TENANT_CACHE_TTL_SECONDS`
  - `REDIS_URL` (base lista para siguiente paso con cache distribuido)

## Colas configuradas

- Se agrego RabbitMQ al stack de infraestructura en `docker/docker-compose.yml`.
- Se implemento cola asincronica en `services/email-service/src/services/notification-queue.service.ts` con:
  - concurrencia configurable
  - reintentos controlados
  - backoff incremental simple
- `EmailService` ahora encola trabajos de envio para desacoplar peticion HTTP del procesamiento.

## Pruebas de rendimiento realizadas

- Validacion estatica de configuracion de compose con servicios de soporte para cache y cola.
- Revision funcional de flujo de encolado de notificaciones en `email-service`.
- Verificacion de no regresion en contrato de respuesta del endpoint de envio de email (`status: queued`).

## Problemas encontrados

- No existia infraestructura de cache/colas en el compose base.
- El flujo de notificaciones era sincrono y no tenia reintentos.
- Las validaciones de tenant se recalculaban en cada request sin TTL.

## Decisiones tecnicas

- Implementar primero cache TTL local en `api-gateway` para impacto rapido con bajo riesgo.
- Dejar `REDIS_URL` y contenedor Redis activos para evolucion a cache distribuido.
- Empezar colas en `email-service` con worker interno y reintentos configurables antes de integrar consumidor AMQP dedicado.
- Mantener enfoque incremental para medir mejora de latencia sin afectar consistencia funcional.

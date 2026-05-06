# Fase 11 - Servicios externos

## Fecha de implementacion

- 2026-04-21

## Servicios implementados

- `services/email-service`
- `services/whatsapp-service`
- `services/file-service`

## Funcionalidades completadas

- Envio de correos con validacion de formato y plantillas basicas.
- Envio de mensajes por WhatsApp con validacion E.164.
- Carga y consulta de metadatos de archivos con control por tenant.
- Integracion de endpoints en `apps/api-gateway`.

## Integracion con otros servicios validada

- `api-gateway` valida JWT y tenant antes de enrutar.
- Notificaciones integradas para flujos de `scheduling`.
- Carga de archivos integrada para flujos de `clinical`.

## Reglas aplicadas

- Toda notificacion devuelve evento auditable (`email_sent`, `message_sent`).
- Los archivos quedan ligados a `tenantId` y se restringe lectura por tenant.
- Se aplican validaciones de email, telefono y tipo/tamano de archivo.
- Los fallos de servicios externos responden sin bloquear otros modulos.

## Pruebas ejecutadas

- Prueba funcional de rutas gateway:
  - `POST /gateway/notifications/email`
  - `POST /gateway/notifications/whatsapp`
  - `POST /gateway/files/upload`
  - `GET /gateway/files/:fileId?tenantId=...`
- Verificacion de validaciones de entrada en cada servicio externo.

## Problemas encontrados

- No se encontro implementacion previa de `scheduling-service`; se uso validacion por modulo `scheduling` desde gateway para notificaciones.

## Decisiones tecnicas

- Implementacion inicial desacoplada en NestJS con proveedores mock (`smtp_mock`, `whatsapp_mock`) para permitir evolucion a proveedores reales.
- `file-service` se implementa con almacenamiento en memoria para pruebas locales, manteniendo contrato estable para migracion futura a S3/Blob storage.

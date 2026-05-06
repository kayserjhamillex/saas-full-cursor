# Conexion Frontend <-> Ecosistema Backend (9 microservicios + 3 servicios)

Este documento centraliza el contrato de interconexion entre `frontend/angular-app` y el backend distribuido.

Objetivo: que al optimizar backend en microservicios no se rompan contratos, headers, estados HTTP ni payloads.

---

## 1) Inventario de backend de la plataforma

Segun CI/CD, el ecosistema backend actual considera:

### 1.1 Microservicios backend (9)

1. `apps/api-gateway`
2. `apps/auth-service`
3. `apps/core-service`
4. `apps/clinical-service`
5. `apps/inventory-service`
6. `apps/hr-service`
7. `apps/financial-service`
8. `apps/assets-service`
9. `apps/scheduling-service`

### 1.2 Servicios especializados (3)

1. `services/email-service`
2. `services/whatsapp-service`
3. `services/file-service`

---

## 2) Estado de consumo desde frontend (Angular)

### 2.1 Integraciones activas hoy

El frontend Angular hoy consume, a traves de gateway, endpoints de:

- **Auth** (`auth-service`)
- **Notifications** (orquesta `email-service` y `whatsapp-service`)
- **Files** (`file-service`)

### 2.2 Integraciones aun no consumidas por Angular

No hay consumo directo actual documentado desde este frontend para:

- `core-service`
- `clinical-service`
- `inventory-service`
- `hr-service`
- `financial-service`
- `assets-service`
- `scheduling-service`

Recomendacion: cuando se habiliten endpoints para esos dominios, usar el mismo estandar de contrato definido en este documento (headers, errores, versionado, trazabilidad).

---

## 3) Base URL, ruteo y convenciones globales

- **Desarrollo frontend:** `gatewayBaseUrl = http://localhost:3000/gateway`
- **Produccion frontend:** `gatewayBaseUrl = /gateway`
- Construccion URL: `gatewayBaseUrl + /<path>`

Ejemplos:

- `http://localhost:3000/gateway/auth/login`
- `/gateway/notifications/email`
- `/gateway/files/upload`

---

## 4) Headers y seguridad de transporte

## 4.1 Auth endpoints (login/recover/verify/update)

Consumidos con `fetch` directo en `AuthService`:

- Header enviado:
  - `Content-Type: application/json`
- No envia `Authorization` ni `x-tenant-id`.
- `tenantId` viaja en body.

## 4.2 Endpoints protegidos via gateway (`GatewayFetchService`)

Reglas aplicadas por frontend:

- Si hay body JSON string y no viene header, agrega:
  - `Content-Type: application/json`
- Por defecto (`withAuth=true`) agrega:
  - `Authorization: Bearer <token>`
  - `x-tenant-id: <tenantId>`
- Si backend responde `401` con `withAuth=true`:
  - frontend hace logout automatico.

---

## 5) Contrato detallado por endpoint consumido

## 5.1 Dominio Auth (`auth-service`)

### POST `/gateway/auth/login`

- **Request**
```json
{
  "email": "user@dominio.com",
  "password": "string",
  "tenantId": "tenant-123"
}
```

- **Response minimo esperado por frontend**
```json
{
  "accessToken": "jwt"
}
```
Tambien compatible:
```json
{
  "token": "jwt"
}
```

- **Comportamiento frontend**
  - `!ok` => error `"Credenciales invalidas o tenant no autorizado"`.
  - `ok` sin `accessToken/token` => error `"Respuesta de login sin token"`.
  - `ok` con token => guarda en localStorage:
    - `admin_access_token`
    - `admin_tenant_id`

### POST `/gateway/auth/recover`

- **Request**
```json
{
  "email": "user@dominio.com",
  "tenantId": "tenant-123"
}
```

- **Response esperado**
  - cualquier JSON con `2xx`.

- **Comportamiento frontend**
  - `!ok` => `"Endpoint aun no disponible en backend"`.

### POST `/gateway/auth/verify-code`

- **Request**
```json
{
  "email": "user@dominio.com",
  "tenantId": "tenant-123",
  "code": "123456"
}
```

- **Response esperado**
  - cualquier JSON con `2xx`.

- **Comportamiento frontend**
  - `!ok` => `"Endpoint aun no disponible en backend"`.

### POST `/gateway/auth/update-password`

- **Request**
```json
{
  "email": "user@dominio.com",
  "tenantId": "tenant-123",
  "code": "123456",
  "newPassword": "NuevaClaveSegura"
}
```

- **Response esperado**
  - cualquier JSON con `2xx`.

- **Comportamiento frontend**
  - `!ok` => `"Endpoint aun no disponible en backend"`.

---

## 5.2 Dominio Notifications (gateway -> email/whatsapp services)

### POST `/gateway/notifications/email`

- **Headers**
  - `Authorization: Bearer <jwt>`
  - `x-tenant-id: <tenantId>`
  - `Content-Type: application/json`

- **Request**
```json
{
  "tenantId": "tenant-123",
  "to": "destino@dominio.com",
  "subject": "Recordatorio",
  "template": "appointment_reminder",
  "variables": {
    "patientName": "Juan Perez",
    "appointmentDate": "2026-04-22 10:00"
  }
}
```

- **Response/estado esperado**
  - `2xx` => `ok`
  - `4xx/5xx` => `http_error`
  - excepcion red/timeout => `network`

### POST `/gateway/notifications/whatsapp`

- **Headers**
  - `Authorization: Bearer <jwt>`
  - `x-tenant-id: <tenantId>`
  - `Content-Type: application/json`

- **Request**
```json
{
  "tenantId": "tenant-123",
  "phoneNumber": "+5491112345678",
  "message": "Texto de WhatsApp",
  "eventType": "appointment_reminder"
}
```

- **Response/estado esperado**
  - `2xx` => `ok`
  - `4xx/5xx` => `http_error`
  - excepcion red/timeout => `network`

---

## 5.3 Dominio Files (`file-service`)

### POST `/gateway/files/upload`

- **Headers**
  - `Authorization: Bearer <jwt>`
  - `x-tenant-id: <tenantId>`
  - `Content-Type: application/json`

- **Request**
```json
{
  "tenantId": "tenant-123",
  "patientId": "patient-1",
  "encounterId": "encounter-1",
  "sourceModule": "services",
  "fileName": "estudio.pdf",
  "mimeType": "application/pdf",
  "fileBase64": "<base64>"
}
```

- **Response recomendado**
```json
{
  "id": "file-id"
}
```

- **Comportamiento frontend**
  - `2xx` con `id` => exito.
  - `2xx` sin `id` => exito igual (mensaje `sin id`).
  - `!ok` => `http_error`.
  - red => `network`.

### GET `/gateway/files/{fileId}?tenantId={tenantId}`

- **Headers**
  - `Authorization: Bearer <jwt>`
  - `x-tenant-id: <tenantId>`

- **Query/path**
  - `fileId` URL-encoded.
  - `tenantId` en query (ademas del header).

- **Response esperado**
  - `2xx` => JSON libre de metadata.
  - `4xx/5xx` => `http_error`.
  - red => `network`.

---

## 6) Mapeo backend -> mensajes de UI (servicios)

Mensajes finales que ve usuario (desde `ServicesIntegrationsService`):

- Exito:
  - `"Correo enviado correctamente."`
  - `"WhatsApp enviado correctamente."`
  - `"Metadata consultada correctamente."`
  - `"Archivo subido correctamente. fileId: <id|sin id>"`

- Error HTTP:
  - `"No se pudo enviar correo."`
  - `"No se pudo enviar WhatsApp."`
  - `"No se pudo consultar metadata del archivo."`
  - `"No se pudo subir archivo."`

- Error de red:
  - `"Error de conexion. Comprueba tu red o vuelve a intentar en unos minutos."`

---

## 7) Guia de interconexion para TODOS los backends (9+3)

Para que frontend y microservicios se mantengan compatibles a futuro, cada nuevo endpoint (core, clinical, inventory, hr, financial, assets, scheduling) deberia cumplir el mismo estandar:

1. **Ruteo por gateway**
   - prefijo claro por dominio (`/core/*`, `/clinical/*`, etc.).
2. **Multi-tenant**
   - aceptar `x-tenant-id` y validar coherencia con JWT cuando aplique.
3. **Autenticacion**
   - `401` para token invalido/expirado.
   - `403` para falta de permisos.
4. **Errores consistentes**
   - JSON comun sugerido:
```json
{
  "code": "DOMAIN_ERROR_CODE",
  "message": "Mensaje legible",
  "details": {},
  "requestId": "uuid"
}
```
5. **Trazabilidad**
   - propagar `x-request-id` entre gateway, microservicio y servicios.
6. **Versionado**
   - cambios breaking via version (`/v1`, `/v2`) o estrategia acordada.
7. **Contratos fuertes**
   - usar DTOs estables y evitar cambiar nombres/tipos sin migracion.

---

## 8) Matriz de ownership sugerida

- `api-gateway`: auth de borde, routing, observabilidad, request-id.
- `auth-service`: login/recover/verify/update, emision/validacion token.
- `core-service`: configuraciones base/tenants/shared domain.
- `clinical-service`: dominio clinico (paciente, encounters, etc.).
- `inventory-service`: stock/insumos.
- `hr-service`: RRHH.
- `financial-service`: pagos/facturacion/finanzas.
- `assets-service`: activos.
- `scheduling-service`: agenda/citas.
- `email-service`: envio correo.
- `whatsapp-service`: envio whatsapp.
- `file-service`: storage y metadata de archivos.

---

## 9) Checklist de backend antes de liberar (global)

## 9.1 Para endpoints ya consumidos por Angular

- [ ] `POST /auth/login` devuelve `accessToken` o `token`.
- [ ] `POST /auth/recover`, `/auth/verify-code`, `/auth/update-password` responden `2xx` con JSON.
- [ ] `POST /notifications/email` y `/notifications/whatsapp` aceptan payload exacto.
- [ ] `POST /files/upload` acepta `fileBase64` y devuelve `{ "id": "..." }` (ideal).
- [ ] `GET /files/{fileId}?tenantId=...` retorna JSON con `2xx`.
- [ ] Rutas protegidas responden `401` correctamente.

## 9.2 Para nuevos endpoints (core/clinical/inventory/hr/financial/assets/scheduling)

- [ ] Definir contrato request/response y publicarlo antes de integrar frontend.
- [ ] Soportar `Authorization` y `x-tenant-id` en rutas protegidas.
- [ ] Estandarizar errores con `code/message/requestId`.
- [ ] Documentar casos `2xx/4xx/5xx`.
- [ ] Incluir pruebas de contrato entre gateway y microservicio.
- [ ] Incluir trazabilidad distribuida (`x-request-id`).

---

## 10) Checklist por equipo (para sprint planning)

Esta seccion separa responsabilidades para que cada equipo backend avance en paralelo sin romper integracion con frontend.

## 10.1 Equipo API Gateway (`apps/api-gateway`)

- [ ] Mantener rutas estables hacia auth/notifications/files y futuros dominios.
- [ ] Propagar `Authorization`, `x-tenant-id` y `x-request-id`.
- [ ] Unificar formato de error hacia frontend:
  - `code`, `message`, `details`, `requestId`.
- [ ] Devolver `401` cuando corresponda (token invalido/expirado).
- [ ] Evitar transformar respuestas `2xx` de forma incompatible.
- [ ] Publicar mapa actualizado de rutas gateway -> microservicio.

## 10.2 Equipo Auth (`apps/auth-service`)

- [ ] `POST /auth/login` devuelve `accessToken` (o `token` por compatibilidad).
- [ ] Validar `tenantId` contra credenciales.
- [ ] Mantener contratos de:
  - `/auth/recover`
  - `/auth/verify-code`
  - `/auth/update-password`
- [ ] Responder con JSON consistente en `2xx` y errores semanticos en `4xx`.
- [ ] Documentar codigos de error por caso (credenciales, tenant, codigo invalido, etc.).

## 10.3 Equipo Core (`apps/core-service`)

- [ ] Definir endpoints base para configuraciones globales/tenants si seran consumidos por frontend.
- [ ] Contratos versionados desde inicio (`v1`) para evitar breaking changes.
- [ ] Estandarizar DTOs con naming estable y tipos explicitos.
- [ ] Alinear manejo multi-tenant (`x-tenant-id`) en todas las rutas protegidas.

## 10.4 Equipo Clinical (`apps/clinical-service`)

- [ ] Definir contratos para entidades clinicas (paciente, encounter, etc.) antes de integrar UI.
- [ ] Incluir `tenantId` y reglas de autorizacion por recurso.
- [ ] Exponer errores de negocio con `code` claro (ej: `PATIENT_NOT_FOUND`).
- [ ] Asegurar idempotencia donde aplique (ej. operaciones repetibles).

## 10.5 Equipo Inventory (`apps/inventory-service`)

- [ ] Definir endpoints CRUD con filtros/paginacion estables.
- [ ] Garantizar consistencia de stock con respuestas deterministicas.
- [ ] Exponer errores de negocio tipados (`INSUFFICIENT_STOCK`, etc.).
- [ ] Incorporar `x-request-id` para trazabilidad de movimientos.

## 10.6 Equipo HR (`apps/hr-service`)

- [ ] Definir contratos para recursos de RRHH con validacion de roles/permisos.
- [ ] Estandarizar fechas, estados y enums en respuesta.
- [ ] Mantener convencion de errores y trazabilidad distribuida.

## 10.7 Equipo Financial (`apps/financial-service`)

- [ ] Definir contratos para pagos/facturacion con precision monetaria consistente.
- [ ] Asegurar campos obligatorios de conciliacion (`transactionId`, `status`, `currency`).
- [ ] Mapear errores de integracion externa (pasarela de pago) con codigos internos claros.
- [ ] Evitar cambios breaking sin versionado.

## 10.8 Equipo Assets (`apps/assets-service`)

- [ ] Definir modelo y contratos de activos con IDs estables.
- [ ] Estandarizar filtros/orden/paginacion.
- [ ] Alinear control de acceso por tenant y permisos.

## 10.9 Equipo Scheduling (`apps/scheduling-service`)

- [ ] Definir contratos de agenda/citas (create, reprogramar, cancelar, listar).
- [ ] Estandarizar zonas horarias y formato datetime (ISO 8601).
- [ ] Exponer errores de colision de agenda con codigo de negocio claro.

## 10.10 Equipo Email (`services/email-service`)

- [ ] Aceptar payload actual de notificaciones (`to`, `subject`, `template`, `variables`).
- [ ] Versionar templates y validar variables requeridas.
- [ ] Retornar estado de entrega de forma consistente al gateway.
- [ ] Propagar `requestId` para troubleshooting.

## 10.11 Equipo WhatsApp (`services/whatsapp-service`)

- [ ] Aceptar payload actual (`phoneNumber`, `message`, `eventType`).
- [ ] Normalizar formato E.164 del numero de destino.
- [ ] Exponer errores de proveedor con `code` interno estable.
- [ ] Propagar `requestId` y estado de entrega al gateway.

## 10.12 Equipo Files (`services/file-service`)

- [ ] Mantener contrato de upload con `fileBase64` y metadata actual.
- [ ] Responder `id` de archivo en `2xx` (recomendado, aunque hoy frontend tolera ausencia).
- [ ] Mantener contrato de metadata por `fileId`.
- [ ] Documentar limites:
  - tamano maximo
  - tipos MIME permitidos
  - politicas de expiracion/retencion

---

## 11) Definition of Ready para integrar frontend con un nuevo microservicio

Antes de que frontend integre un nuevo dominio (core/clinical/inventory/hr/financial/assets/scheduling):

- [ ] Endpoint publicado en gateway.
- [ ] Contrato request/response documentado.
- [ ] Manejo de errores acordado (`code/message/requestId`).
- [ ] Estrategia de auth/tenant validada.
- [ ] Casos borde definidos (empty/error/success).
- [ ] Ejemplos de payload reales compartidos con frontend.

## 12) Definition of Done para release cross-service

- [ ] CI de cada servicio en verde.
- [ ] Contratos backend no rompieron tests del frontend.
- [ ] `frontend/angular-app` pasa:
  - lint
  - unit tests
  - e2e mockeado
- [ ] Se registraron cambios de contrato en este documento.
- [ ] Equipo backend y frontend validaron ejemplos reales end-to-end.


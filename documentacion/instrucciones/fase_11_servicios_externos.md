# fase_11_servicios_externos.md

Fase 11 — Servicios Externos (Email, WhatsApp y Gestión de Archivos)

---

1. Descripción de la fase

Esta fase implementa los servicios externos del sistema SaaS clínico, encargados de la comunicación con usuarios y la gestión de archivos clínicos.

Se desarrollan como microservicios desacoplados para garantizar escalabilidad, reutilización y aislamiento de responsabilidades.

Estos servicios son fundamentales para la operación real del sistema, ya que permiten:

* Notificaciones automáticas (citas, pagos, recordatorios)
* Comunicación con clientes (email y WhatsApp)
* Almacenamiento y gestión de archivos clínicos e imágenes

Depende de:

* /documentacion/reglas
* /documentacion/database
* Fase 2 (SaaS)
* Fase 3 (clínico)
* Fase 5 (IA)
* Fase 10 (agendamiento)

---

2. Objetivo técnico

Implementar servicios desacoplados que permitan:

* Envío de correos electrónicos
* Envío de mensajes por WhatsApp
* Gestión y almacenamiento de archivos
* Integración con todos los módulos del sistema
* Manejo de comunicación asincrónica

---

3. Carpetas involucradas

/services/email-service
/services/whatsapp-service
/services/file-service
/apps/api-gateway
/apps/core-service
/apps/clinical-service
/apps/scheduling-service
/documentacion/reglas
/documentacion/database
/documentacion/avance

---

4. Responsabilidades por carpeta

/services/email-service

* Envío de correos electrónicos
* Plantillas de notificación
* Gestión de colas de envío

/services/whatsapp-service

* Envío de mensajes
* Notificaciones de citas y pagos
* Integración con proveedor externo

/services/file-service

* Almacenamiento de archivos
* Gestión de imágenes clínicas
* Control de acceso a archivos

/apps/api-gateway

* Enrutamiento
* Validación de acceso

/apps/core-service

* Disparadores de eventos SaaS (pagos, vencimientos)

/apps/clinical-service

* Envío de resultados y archivos clínicos

/apps/scheduling-service

* Notificaciones de citas

/documentacion/reglas

* Reglas de comunicación y seguridad

/documentacion/database

* Tablas relacionadas a archivos si aplica

/documentacion/avance

* Registro del progreso técnico

---

5. Flujo de datos

Notificación de cita

1. Se crea o modifica una cita
2. scheduling-service genera evento
3. Se envía a email-service / whatsapp-service
4. Se envía notificación al usuario

---

Recordatorio de pago

1. Se detecta vencimiento de suscripción
2. core-service genera evento
3. Se envía notificación
4. Usuario recibe mensaje

---

Gestión de archivos

1. Usuario carga archivo
2. Se envía a file-service
3. Se almacena
4. Se retorna URL
5. Se vincula a entidad (paciente, resultado IA)

---

6. Interacción entre microservicios

* core-service → email-service
* scheduling-service → whatsapp-service
* clinical-service → file-service
* ai-service → file-service

Reglas:

* Comunicación mediante eventos o APIs
* Servicios externos no acceden directamente a BD principal

---

7. Eventos (event-driven)

Eventos definidos:

* notification_requested
* email_sent
* message_sent
* file_uploaded

Uso:

* comunicación
* auditoría
* monitoreo

---

8. Estructura lógica interna

/email-service

* controllers:

  * email.controller

* services:

  * email.service
  * template.service

---

/whatsapp-service

* controllers:

  * whatsapp.controller

* services:

  * whatsapp.service

---

/file-service

* controllers:

  * file.controller

* services:

  * file.service
  * storage.service

---

9. Reglas de negocio

* Toda notificación debe ser registrada
* Los archivos deben tener control de acceso
* Las notificaciones deben ser configurables
* No se debe bloquear flujo principal por fallos externos
* Se deben permitir reintentos

---

10. Validaciones

* formato de correo válido
* número de teléfono válido
* archivo permitido (tipo, tamaño)
* integridad de datos

---

11. Seguridad

* Validación JWT en acceso a archivos
* Control de acceso a recursos
* Protección de datos sensibles
* Manejo seguro de archivos

---

12. Testing (TDD / BDD / DDD)

TDD

* envío de email
* envío de mensajes
* carga de archivos

Integración

* flujo completo notificaciones

DDD

* reglas de comunicación

---

13. Dependencias técnicas

* Node.js / NestJS
* FastAPI (si se integra con IA)
* servicios externos (SMTP, WhatsApp API)
* almacenamiento (local o cloud)
* Docker

---

14. Riesgos técnicos

* fallos en servicios externos
* pérdida de notificaciones
* problemas de almacenamiento
* latencia en envíos

---

15. Resultado esperado

* Sistema de notificaciones funcional
* Comunicación automática operativa
* Gestión de archivos completa
* Integración con todos los módulos
* Sistema listo para entorno real

---

16. Registro de avance (documentacion/avance)

Se debe generar:

/documentacion/avance/fase_11.md

Contenido:

* Fecha de implementación
* Servicios implementados:

  * email-service
  * whatsapp-service
  * file-service
* Funcionalidades completadas:

  * envío de correos
  * envío de mensajes
  * gestión de archivos
* Integración con otros servicios validada
* Reglas aplicadas
* Pruebas ejecutadas
* Problemas encontrados
* Decisiones técnicas

---

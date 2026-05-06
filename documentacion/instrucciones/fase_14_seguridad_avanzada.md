# Fase 14 — Seguridad Avanzada, Auditoría y Control de Accesos

---

1. Descripción de la fase

Esta fase implementa los mecanismos avanzados de seguridad del sistema SaaS clínico, asegurando la protección de datos sensibles, la trazabilidad de acciones y el control granular de accesos.

Se establecen controles que permiten cumplir estándares de seguridad (ISO 27000), especialmente relevantes por el manejo de información clínica, financiera y personal.

Esta fase transforma el sistema de “funcional” a “seguro en producción”.

Depende de:

* Todas las fases anteriores (1–13)
* /documentacion/reglas
* /documentacion/database

---

2. Objetivo técnico

Implementar una capa de seguridad que permita:

* Auditoría completa de acciones
* Trazabilidad por usuario y tenant
* Control de acceso avanzado (RBAC / ABAC)
* Protección contra ataques comunes
* Rate limiting
* Gestión segura de sesiones
* Hardening de servicios

---

3. Carpetas involucradas

/apps/api-gateway
/apps/auth-service
/apps/core-service
/apps/* (todos los microservicios)
/services/*
/documentacion/reglas
/documentacion/database
/documentacion/avance

---

4. Responsabilidades por componente

/apps/api-gateway

* Validación centralizada de seguridad
* Rate limiting
* Validación de tokens
* Filtros de acceso

---

/apps/auth-service

* Gestión de autenticación segura
* Manejo de tokens
* Expiración y renovación

---

/apps/core-service

* Control de roles y permisos
* Gestión de acceso por tenant

---

/apps/*

* Aplicación de reglas de seguridad
* Validación de accesos por endpoint

---

/documentacion/reglas

* Definición de políticas de seguridad

---

/documentacion/database

* Tablas:

  * audit_logs
  * access_logs
  * roles
  * permissions
  * user_sessions

---

/documentacion/avance

* Registro del progreso técnico

---

5. Flujo de datos

Acceso a sistema

1. Usuario envía request con JWT
2. API Gateway valida token
3. Se aplica rate limiting
4. Se valida rol y permisos
5. Se registra acceso en logs
6. Se permite o deniega acceso

---

Auditoría

1. Usuario realiza acción
2. Se registra evento en audit_logs
3. Se almacena:

   * usuario
   * acción
   * timestamp
   * entidad afectada

---

Gestión de sesiones

1. Usuario inicia sesión
2. Se registra sesión
3. Se controla expiración
4. Se permite invalidación

---

6. Interacción entre microservicios

* api-gateway → todos los servicios
* auth-service → core-service (roles/permisos)

Reglas:

* Seguridad centralizada en gateway
* Validación adicional en cada servicio

---

7. Eventos (event-driven)

Eventos definidos:

* login_success
* login_failed
* access_denied
* action_logged
* suspicious_activity_detected

Uso:

* auditoría
* seguridad
* monitoreo

---

8. Estructura lógica interna

/api-gateway

* middlewares:

  * auth.middleware
  * rate-limit.middleware
  * role.middleware

* services:

  * security.service

---

/auth-service

* services:

  * auth.service
  * token.service
  * session.service

---

/core-service

* services:

  * role.service
  * permission.service

---

9. Reglas de negocio

* Toda acción debe ser auditada
* Ningún endpoint debe ser accesible sin validación
* Los permisos deben ser explícitos
* Las sesiones deben poder invalidarse
* Los accesos deben registrarse

---

10. Validaciones

* token válido
* rol autorizado
* permisos correctos
* sesión activa
* tenant válido

---

11. Seguridad implementada

* JWT con expiración
* bcrypt para contraseñas
* rate limiting
* protección contra:

  * SQL Injection
  * XSS
  * CSRF
* control de accesos por roles
* auditoría completa

---

12. Testing (TDD / BDD / DDD)

TDD

* validación de tokens
* control de acceso

Integración

* flujo completo de autenticación y autorización

DDD

* reglas de dominio de seguridad

---

13. Dependencias técnicas

* NestJS
* JWT
* bcrypt
* PostgreSQL
* Docker

---

14. Riesgos técnicos

* brechas de seguridad
* acceso no autorizado
* mal manejo de sesiones
* logs incompletos

---

15. Resultado esperado

* Sistema seguro en producción
* Auditoría completa
* Control de acceso robusto
* Protección contra ataques
* Cumplimiento de estándares de seguridad

---

16. Registro de avance (documentacion/avance)

Se debe generar:

/documentacion/avance/fase_14.md

Contenido:

* Fecha de implementación
* Mecanismos de seguridad implementados
* Auditoría configurada
* Control de accesos validado
* Logs implementados
* Pruebas ejecutadas
* Problemas encontrados
* Decisiones técnicas

---

17. Plan operativo de implementacion

Secuencia recomendada de ejecucion:

1. Preparar tablas y estructuras de seguridad:

   * roles
   * permissions
   * role_permissions
   * user_sessions
   * audit_logs
   * access_logs

2. Implementar middleware de autenticacion en gateway:

   * validacion JWT
   * validacion de tenant (`x-tenant-id`)
   * correlacion de request (`x-request-id`)

3. Implementar middleware de autorizacion:

   * validacion de rol
   * validacion por permiso explicito (RBAC)
   * reglas contextuales por tenant/modulo (ABAC basico)

4. Implementar rate limiting por:

   * IP
   * usuario autenticado
   * endpoint sensible (`/auth/login`, `/gateway/*`)

5. Implementar auditoria transversal:

   * captura de actor, accion, recurso, resultado
   * persistencia en `audit_logs`
   * mascara de campos sensibles (password, token, secretos)

6. Implementar registro de accesos:

   * endpoint, metodo, status, latencia
   * persistencia en `access_logs`
   * marca de eventos anormales (`suspicious_activity_detected`)

7. Endurecer sesiones y tokens:

   * expiracion corta para access token
   * refresh token rotativo
   * invalidacion por cierre de sesion / revocacion

8. Ejecutar pruebas de seguridad y regresion:

   * accesos permitidos/denegados por rol
   * rate limiting por rafaga
   * revocacion de sesion activa
   * trazabilidad completa en logs

---

18. Criterios de aceptacion de la fase

La fase se considera completa si se cumple todo lo siguiente:

* Todo endpoint protegido exige JWT valido y tenant consistente
* Ningun usuario puede ejecutar acciones sin permiso explicito
* Se generan registros en `audit_logs` para acciones criticas
* Se generan registros en `access_logs` para toda request del gateway
* El rate limiting bloquea rafagas y responde error controlado
* Las sesiones pueden invalidarse y no permiten reutilizacion indebida
* Existe evidencia de pruebas funcionales y de seguridad

---

19. Entregables minimos obligatorios

* Codigo en gateway y servicios con middlewares de seguridad
* Scripts SQL/migraciones para tablas de seguridad y auditoria
* Politica de roles/permisos documentada en `/documentacion/reglas`
* Evidencia de pruebas en `/documentacion/avance/fase_14.md`
* Actualizacion del manual de usuario con pruebas de Fase 14

#Fase 1 — Arquitectura Base, Seguridad y Control de Acceso

---

1. Descripción de la fase

Esta fase establece la arquitectura base del sistema SaaS clínico, definiendo los mecanismos de autenticación, autorización, validación multi-tenant y control de acceso mediante API Gateway.

Se construyen los fundamentos sobre los cuales se desarrollarán todos los módulos posteriores, asegurando coherencia arquitectónica, seguridad transversal y escalabilidad.

Esta fase es dependiente de:

* /documentacion/reglas
* /documentacion/database

---

2. Objetivo técnico

Implementar una base arquitectónica que permita:

* Autenticación segura mediante JWT
* Validación obligatoria de tenant
* Enrutamiento centralizado mediante API Gateway
* Protección de endpoints
* Integración coherente con base de datos
* Cumplimiento de reglas de desarrollo

---

3. Carpetas involucradas

/apps/api-gateway
/apps/auth-service
/apps/core-service
/documentacion/reglas
/documentacion/database
/documentacion/avance

---

4. Responsabilidades por carpeta

/apps/api-gateway

* Punto único de entrada
* Validación JWT
* Validación tenant
* Enrutamiento

/apps/auth-service

* Autenticación
* Generación de tokens
* Validación de credenciales

/apps/core-service

* Gestión de tenants
* Validación de tenant activo
* Validación de suscripciones

/documentacion/reglas

* Normas obligatorias

/documentacion/database

* Modelo de datos

/documentacion/avance

* Registro del progreso técnico de la fase

---

5. Flujo de datos

Login

1. Usuario envía credenciales
2. Gateway redirige a auth-service
3. Validación contra base de datos
4. Generación de JWT
5. Retorno al cliente

Acceso protegido

1. Request con JWT
2. Gateway valida token
3. Validación tenant
4. Enrutamiento
5. Respuesta

---

6. Reglas de negocio

* JWT obligatorio
* Tenant obligatorio
* Todo pasa por gateway
* Validación previa obligatoria
* Cumplimiento de /documentacion/reglas

---

7. Validaciones

* Credenciales correctas
* Token válido
* Tenant activo

---

8. Seguridad

* JWT
* bcrypt
* Validación de inputs

---

9. Testing

* TDD en autenticación
* Pruebas de integración

---

10. Dependencias

* NestJS
* JWT
* PostgreSQL
* Docker

---

11. Resultado esperado

Sistema autenticado funcional con control total desde API Gateway

---

12. Registro de avance (documentacion/avance)

Se debe generar un archivo:

/documentacion/avance/fase_1.md

Contenido del avance:

* Fecha de implementación
* Servicios implementados:

  * api-gateway
  * auth-service
  * core-service
* Funcionalidades completadas:

  * autenticación JWT
  * validación tenant
  * routing base
* Integración con base de datos validada
* Reglas de desarrollo aplicadas
* Pruebas ejecutadas
* Problemas encontrados (si aplica)
* Decisiones técnicas tomadas

Este registro es obligatorio para trazabilidad y control del desarrollo.

---

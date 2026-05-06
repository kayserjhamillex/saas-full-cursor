#Fase 2 — Lógica SaaS, Suscripciones y Gestión de Tenants

---

1. Descripción de la fase

Esta fase implementa el núcleo del modelo SaaS del sistema, definiendo la gestión de tenants, suscripciones, pagos y control de módulos habilitados.

Se encarga de gobernar el acceso al sistema a nivel comercial y operativo, determinando qué funcionalidades están disponibles para cada cliente (tenant) en función de su estado de suscripción.

Esta fase depende estrictamente de:

* /documentacion/reglas
* /documentacion/database
* Fase 1 (autenticación y validación base)

---

2. Objetivo técnico

Implementar la lógica SaaS que permita:

* Gestión completa de tenants
* Administración de suscripciones
* Registro y control de pagos
* Activación y desactivación de módulos
* Bloqueo automático por falta de pago
* Integración con eventos del sistema

---

3. Carpetas involucradas

/apps/core-service
/apps/api-gateway
/documentacion/reglas
/documentacion/database
/documentacion/avance

---

4. Responsabilidades por carpeta

/apps/core-service

* Gestión de tenants
* Gestión de suscripciones
* Registro de pagos
* Control de módulos activos
* Validación de acceso según estado SaaS

/apps/api-gateway

* Consulta de estado del tenant antes de enrutar
* Bloqueo de acceso si el tenant está inactivo

/documentacion/reglas

* Definición de reglas de negocio y arquitectura

/documentacion/database

* Tablas:

  * tenants
  * subscriptions
  * payments
  * tenant_modules

/documentacion/avance

* Registro del progreso técnico

---

5. Flujo de datos

Creación de tenant

1. Se registra un nuevo tenant
2. Se crea su suscripción inicial
3. Se asignan módulos básicos
4. Se habilita acceso

---

Flujo de validación SaaS en request

1. Usuario autenticado realiza request
2. API Gateway valida JWT (fase 1)
3. Gateway consulta core-service
4. core-service valida:

   * tenant activo
   * suscripción vigente
   * módulos habilitados
5. Si es válido → continúa
6. Si no → se bloquea acceso

---

Flujo de pago

1. Se registra un pago
2. Se actualiza suscripción
3. Se reactivan módulos
4. Se genera evento

---

Flujo de expiración

1. Suscripción vence
2. Se cambia estado del tenant
3. Se deshabilitan módulos
4. Se bloquea acceso

---

6. Interacción entre microservicios

* api-gateway → core-service (validación SaaS)

Reglas:

* Toda validación de negocio SaaS se realiza en core-service
* Gateway no contiene lógica de negocio

---

7. Eventos (event-driven)

Eventos definidos:

* tenant_created
* subscription_created
* payment_received
* subscription_expired
* modules_activated
* modules_deactivated

Uso:

* notificaciones
* auditoría
* sincronización entre servicios

---

8. Estructura lógica interna

/core-service

* controllers:

  * tenant.controller
  * subscription.controller
  * payment.controller

* services:

  * tenant.service
  * subscription.service
  * payment.service
  * module.service

* repositories:

  * tenant.repository
  * subscription.repository
  * payment.repository

* domain:

  * tenant.entity
  * subscription.entity
  * payment.entity

---

9. Reglas de negocio

* Un tenant debe tener al menos una suscripción activa
* No se permite acceso si la suscripción está vencida
* Los módulos dependen del plan contratado
* Los pagos actualizan el estado de la suscripción
* Un tenant inactivo no puede consumir ningún servicio

---

10. Validaciones

* tenant existente
* suscripción vigente
* pago registrado correctamente
* módulos activos según plan
* consistencia con base de datos

---

11. Seguridad

* Validación de tenant en cada request
* Restricción de acceso por estado SaaS
* Control de acceso a módulos
* Validación de integridad de pagos

---

12. Testing (TDD / BDD / DDD)

TDD

* creación de tenant
* activación/desactivación de suscripción
* registro de pagos

Integración

* validación gateway → core-service
* bloqueo de acceso por suscripción

DDD

* reglas de negocio SaaS
* consistencia de estados

---

13. Dependencias técnicas

* NestJS
* PostgreSQL
* API Gateway
* Docker

---

14. Riesgos técnicos

* inconsistencia entre pagos y suscripciones
* habilitación incorrecta de módulos
* bypass de validación SaaS
* errores en expiración de suscripciones

---

15. Resultado esperado

* Sistema SaaS completamente funcional
* Control total de acceso por suscripción
* Gestión de tenants operativa
* Integración con arquitectura base
* Base lista para módulos clínicos y ERP

---

16. Registro de avance (documentacion/avance)

Se debe generar:

/documentacion/avance/fase_2.md

Contenido:

* Fecha de implementación
* Servicios implementados:

  * core-service
* Funcionalidades completadas:

  * gestión de tenants
  * gestión de suscripciones
  * registro de pagos
  * control de módulos
* Integración con API Gateway validada
* Integración con base de datos validada
* Reglas de desarrollo aplicadas
* Pruebas ejecutadas
* Problemas encontrados (si aplica)
* Decisiones técnicas tomadas

---

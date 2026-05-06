# Fase 6 — Frontend, Interfaces de Usuario y Consumo de APIs

---

1. Descripción de la fase

Esta fase implementa las interfaces de usuario del sistema SaaS clínico mediante dos aplicaciones frontend:

* React (aplicación clínica operativa)
* Angular (panel administrativo SaaS)

Se encarga de la interacción usuario-sistema, visualización de datos y consumo de APIs backend, respetando la arquitectura definida y las reglas de desarrollo.

Esta fase depende de:

* /documentacion/reglas
* /documentacion/database
* Fase 1 (autenticación)
* Fase 2 (SaaS)
* Fase 3 (clínico)
* Fase 4 (inventario)
* Fase 5 (IA)

---

2. Objetivo técnico

Implementar interfaces que permitan:

* Autenticación de usuarios
* Visualización de dashboards
* Gestión clínica (pacientes, consultas, historia)
* Gestión SaaS (tenants, pagos, módulos)
* Gestión de inventario
* Visualización de resultados de IA
* Consumo eficiente de APIs

---

3. Carpetas involucradas

/frontend/react-app
/frontend/angular-app
/apps/api-gateway
/documentacion/reglas
/documentacion/database
/documentacion/avance

---

4. Responsabilidades por carpeta

/frontend/react-app

* Interfaz clínica
* Gestión de pacientes
* Historia clínica
* Consultas
* Visualización de resultados IA
* Interacción con inventario

/frontend/angular-app

* Panel administrativo SaaS
* Gestión de tenants
* Gestión de suscripciones
* Control de módulos
* Reportes administrativos

/apps/api-gateway

* Punto de consumo de APIs
* Validación de acceso

/documentacion/reglas

* Definición de arquitectura frontend
* Buenas prácticas

/documentacion/database

* Referencia para estructura de datos

/documentacion/avance

* Registro del progreso técnico

---

5. Flujo de datos

Login

1. Usuario ingresa credenciales
2. Frontend envía request al API Gateway
3. Se recibe JWT
4. Se almacena en cliente

---

Consumo de datos

1. Frontend envía request con JWT
2. Gateway valida
3. Request se enruta a microservicio
4. Se retorna respuesta
5. Se renderiza en UI

---

Flujo clínico

1. Usuario crea paciente
2. Se envía request
3. Se registra en backend
4. Se actualiza UI

---

6. Interacción entre componentes

* React → API Gateway
* Angular → API Gateway

Reglas:

* No acceso directo a microservicios
* Todo consumo pasa por Gateway

---

7. Eventos (event-driven)

Eventos considerados:

* user_logged_in
* data_updated
* ai_result_received

Uso:

* actualización de UI
* notificaciones

---

8. Estructura lógica interna

/react-app

* components
* pages
* services (API)
* state (gestión de estado)
* routes

/angular-app

* modules
* components
* services
* guards
* routing

---

9. Reglas de negocio

* No mostrar información sin autenticación
* Respetar roles de usuario
* Mostrar módulos según suscripción
* Sincronización con backend obligatoria
* No duplicar lógica de negocio del backend

---

10. Validaciones

* validación de formularios
* validación de datos recibidos
* consistencia de UI
* manejo de errores

---

11. Seguridad

* Uso de JWT en requests
* Protección de rutas
* Control por roles
* Manejo seguro de tokens

---

12. Testing (TDD / BDD / DDD)

BDD

* flujos de usuario
* navegación

Integración

* consumo de APIs

DDD

* coherencia con dominios backend

---

13. Dependencias técnicas

* React (Vite)
* Angular
* Axios / HTTP client
* Zustand / state management
* Docker

---

14. Riesgos técnicos

* inconsistencias entre frontend y backend
* mala gestión de estado
* fugas de seguridad (tokens)
* duplicación de lógica

---

15. Resultado esperado

* Interfaces funcionales completas
* Integración total con backend
* Experiencia de usuario fluida
* Visualización correcta de datos
* Sistema listo para uso real

---

16. Registro de avance (documentacion/avance)

Se debe generar:

/documentacion/avance/fase_6.md

Contenido:

* Fecha de implementación
* Aplicaciones implementadas:

  * react-app
  * angular-app
* Funcionalidades completadas:

  * login
  * dashboards
  * gestión clínica
  * gestión SaaS
  * inventario
  * visualización IA
* Integración con API Gateway validada
* Reglas aplicadas
* Pruebas ejecutadas
* Problemas encontrados
* Decisiones técnicas

---

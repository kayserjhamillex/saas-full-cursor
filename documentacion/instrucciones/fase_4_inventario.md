# fase_4_inventario.md

Fase 4 — Inventario, Almacenes y Control Kardex (ERP)

---

1. Descripción de la fase

Esta fase implementa el módulo de inventario bajo un enfoque ERP, permitiendo la gestión completa de productos, almacenes, subalmacenes, ubicaciones, stock y movimientos con trazabilidad mediante kardex.

Se garantiza control total de entradas, salidas, transferencias y stock disponible, evitando inconsistencias y permitiendo auditoría completa.

Esta fase depende de:

* /documentacion/reglas
* /documentacion/database
* Fase 1 (seguridad y acceso)
* Fase 2 (validación SaaS)

---

2. Objetivo técnico

Implementar un sistema de inventario que permita:

* Gestión de productos y categorías
* Gestión de almacenes y subalmacenes
* Control de ubicaciones físicas
* Registro de stock
* Control de stock mínimo
* Registro de movimientos (entrada, salida, transferencia)
* Implementación de kardex
* Trazabilidad completa del inventario

---

3. Carpetas involucradas

/apps/inventory-service
/apps/api-gateway
/documentacion/reglas
/documentacion/database
/documentacion/avance

---

4. Responsabilidades por carpeta

/apps/inventory-service

* Gestión de productos
* Gestión de almacenes
* Control de stock
* Registro de movimientos
* Gestión de kardex
* Control de transferencias

/apps/api-gateway

* Validación de acceso
* Enrutamiento hacia inventory-service

/documentacion/reglas

* Validación de lógica ERP
* Reglas de consistencia

/documentacion/database

* Tablas:

  * products
  * categories
  * subcategories
  * warehouses
  * sub_warehouses
  * locations
  * stock
  * stock_minimum
  * inventory_movements
  * kardex_entries
  * transfers

/documentacion/avance

* Registro del progreso técnico

---

5. Flujo de datos

Registro de producto

1. Se crea producto con categoría
2. Se asigna a almacén

---

Entrada de inventario

1. Se registra movimiento tipo entrada
2. Se actualiza stock
3. Se genera registro en kardex

---

Salida de inventario

1. Se registra movimiento tipo salida
2. Se valida stock disponible
3. Se actualiza stock
4. Se registra en kardex

---

Transferencia

1. Se registra transferencia
2. Se descuenta stock origen
3. Se incrementa stock destino
4. Se registra en kardex

---

6. Interacción entre microservicios

* api-gateway → inventory-service

Reglas:

* No acceso directo a otros servicios
* Validación previa en gateway

---

7. Eventos (event-driven)

Eventos definidos:

* product_created
* stock_updated
* inventory_entry
* inventory_exit
* transfer_completed

Uso:

* auditoría
* sincronización
* alertas

---

8. Estructura lógica interna

/inventory-service

* controllers:

  * product.controller
  * inventory.controller
  * warehouse.controller

* services:

  * product.service
  * stock.service
  * movement.service
  * kardex.service

* repositories:

  * product.repository
  * stock.repository
  * movement.repository

* domain:

  * product.entity
  * stock.entity
  * movement.entity

---

9. Reglas de negocio

* No se permite stock negativo
* Todo movimiento genera registro en kardex
* Transferencias deben mantener consistencia
* Stock debe reflejar movimientos acumulados
* Productos deben pertenecer a categorías

---

10. Validaciones

* producto existente
* stock suficiente
* ubicación válida
* integridad de movimientos
* consistencia kardex

---

11. Seguridad

* Validación JWT
* Validación tenant
* Control de acceso a inventario
* Protección de datos

---

12. Testing (TDD / BDD / DDD)

TDD

* movimientos de inventario
* cálculo de stock
* generación de kardex

Integración

* flujo completo inventario

DDD

* consistencia del dominio inventario

---

13. Dependencias técnicas

* NestJS
* PostgreSQL
* Docker

---

14. Riesgos técnicos

* inconsistencias en kardex
* desincronización de stock
* errores en transferencias
* duplicación de movimientos

---

15. Resultado esperado

* Sistema de inventario robusto
* Control total de stock
* Kardex consistente
* Trazabilidad completa
* Base ERP funcional

---

16. Registro de avance (documentacion/avance)

Se debe generar:

/documentacion/avance/fase_4.md

Contenido:

* Fecha de implementación
* Servicios implementados:

  * inventory-service
* Funcionalidades completadas:

  * productos
  * almacenes
  * stock
  * movimientos
  * kardex
* Integración con base de datos validada
* Reglas aplicadas
* Pruebas ejecutadas
* Problemas encontrados
* Decisiones técnicas

---

# AVANCE — FASE 4 INVENTARIO

## Fecha de implementacion

2026-04-21

## Servicios implementados

- `inventory-service`

## Funcionalidades completadas

- Gestion de productos (`products`) con validacion de categoria por tenant.
- Gestion de almacenes (`warehouses`).
- Control de stock por producto y almacen (`stock`).
- Registro de movimientos de inventario (`inventory_movements`) para entradas y salidas.
- Registro de transferencias (`transfers`) con doble movimiento (`transfer_out` y `transfer_in`).
- Kardex por producto/almacen (`kardex_entries`) con saldo acumulado.

## Integracion con API Gateway validada

Se agregaron rutas en `api-gateway` para el dominio de inventario:

- `POST /gateway/inventory/products`
- `POST /gateway/inventory/warehouses`
- `POST /gateway/inventory/stock/entries`
- `POST /gateway/inventory/stock/exits`
- `POST /gateway/inventory/stock/transfers`
- `GET /gateway/inventory/stock/:productId`
- `GET /gateway/inventory/kardex/:productId`

Todas pasan por validacion previa de:

- JWT (`Authorization: Bearer ...`)
- consistencia tenant (`x-tenant-id`)
- validacion SaaS del modulo `inventory` en `core-service`

## Integracion con base de datos validada

El `inventory-service` implementa persistencia para las tablas:

- `products`
- `categories`
- `subcategories`
- `warehouses`
- `sub_warehouses`
- `locations`
- `stock`
- `stock_minimum`
- `inventory_movements`
- `kardex_entries`
- `transfers`

## Reglas aplicadas

- No se permite stock negativo.
- Todo movimiento crea su registro en kardex.
- La transferencia mantiene consistencia: descuenta en origen e incrementa en destino dentro de una transaccion.
- El stock refleja movimientos acumulados.
- El producto se valida por tenant antes de mover inventario.

## Pruebas ejecutadas

- Verificacion de compilacion en `inventory-service` y `api-gateway`.
- Definicion de flujo funcional Fase 4 en `documentacion/manualdeusuario.md`.
- Casos cubiertos en flujo manual:
  - alta de producto
  - alta de almacenes
  - entrada de stock
  - salida de stock
  - transferencia entre almacenes
  - consulta de stock
  - consulta de kardex

## Problemas encontrados

- No aplica en esta iteracion.

## Decisiones tecnicas

- Se fijo prefijo global `inventory` y puerto por defecto `3004` para aislar el microservicio.
- Se implemento transaccionalidad para entradas, salidas y transferencias, asegurando consistencia de stock y kardex.
- Se centralizo la trazabilidad en `kardex_entries` y `inventory_movements` con eventos de dominio:
  - `product_created`
  - `stock_updated`
  - `inventory_entry`
  - `inventory_exit`
  - `transfer_completed`

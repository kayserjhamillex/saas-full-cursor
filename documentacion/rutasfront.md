# Rutas de navegacion de frontends

Estado actual: fase 12 base implementada. Ya existen rutas iniciales en las 3 apps frontend.

## 1) Admin SaaS (Angular)

- Base local esperada: `http://localhost:4200`
- Rutas actuales:
  - `/login`
  - `/recover`
  - `/verify-code`
  - `/update-password`
  - `/`
  - `/clientes`
  - `/tenants`
  - `/suscripciones`
  - `/pagos`
  - `/modulos`
  - `/metricas`
  - `/ia`
  - `/servicios`
- Estado: navegacion principal habilitada con placeholder pages y modo oscuro persistente.

## 2) Panel Frontend (React)

- Base local esperada: `http://localhost:5173`
- Rutas actuales:
  - `/login`
  - `/recover`
  - `/verify-code`
  - `/update-password`
  - `/`
  - `/pacientes`
  - `/historias-clinicas`
  - `/agendamiento`
  - `/disponibilidad`
  - `/inventario`
  - `/patrimonio`
  - `/finanzas`
  - `/ia`
  - `/rrhh`
  - `/servicios`
- Estado: `react-router-dom` operativo con layout clinico, modo oscuro persistente y flujo de autenticacion completo.

## 3) Demo App

- Base local esperada: `http://localhost:4173`
- Rutas actuales:
  - `/`
  - `/simulacion`
  - `/registro`
- Estado: app creada con landing comercial, simulacion basica y formulario de lead local.

## Nota de implementacion

Este archivo documenta rutas de navegacion funcionales (no rutas de carpetas).

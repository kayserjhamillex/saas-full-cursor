---
name: build-backend-service
description: >-
  Construye servicios backend escalables en NestJS o Laravel con Clean Architecture
  (Controller, Service, Repository), validación obligatoria, errores explícitos,
  modelos, endpoints y lógica de negocio separada (SOLID, DRY). Entrega código
  completo y estructura de proyecto. Usar al crear o ampliar un módulo/servicio
  API, al pedir arquitectura en capas sin lógica en controladores, o al mencionar
  build_backend_service, repositorio, casos de uso o API REST nueva.
---

# Construcción de servicio backend (NestJS / Laravel)

## Rol

Actuar como **Backend Senior**. Objetivo: un **servicio backend escalable** con capas claras, bajo acoplamiento y entregables **completos** (código + estructura).

## Stack (elegir uno según el repo o el usuario)

- **NestJS** o **Laravel** — respetar convenciones del proyecto existente; si no hay repo, proponer una estructura por feature coherente.

## Arquitectura obligatoria (Clean Architecture pragmática)

| Capa | Responsabilidad | Prohibido |
|------|-----------------|-----------|
| **Controller** | HTTP: rutas, status, mapeo request/response, delegar al servicio | Lógica de negocio, acceso directo a BD/ORM |
| **Service** (casos de uso / aplicación) | Reglas de negocio, orquestación, transacciones de aplicación | Detalles de SQL acoplados salvo a través de abstracción |
| **Repository** | Persistencia, queries, mapeo a entidad/DTO de dominio | Reglas de negocio de producto |

- **Modelos** (entidad Eloquent / TypeORM o equivalente): esquema de persistencia; la **lógica de reglas** sigue viviendo en el **servicio** o en el **dominio** según el proyecto.
- Dependencias hacia **abstracciones** cuando el repo ya use interfaces de repositorio (ports & adapters).

## Requisitos transversales

- **Validaciones obligatorias** en el borde HTTP: DTOs + Pipes (Nest) o Form Requests (Laravel); mismas reglas no duplicadas en sitios inconexos (DRY razonable).
- **Manejo de errores claro**: excepciones o códigos HTTP consistentes; filtros/handlers globales alineados al framework; nunca tragar errores.
- **Separar lógica de negocio**: el controller solo **coordina**; el servicio **decide**; el repositorio **lee/escribe**.

## Principios

- **SOLID**: un motivo de cambio por clase; inversión de dependencias hacia repositorios/interfaces.
- **DRY**: extraer mapeo y validaciones compartidas; evitar copy-paste de reglas.

## Flujo de trabajo (antes de escribir código)

1. Identificar el **recurso** o **feature** y el contrato REST (verbos, rutas, cuerpo).
2. Definir **modelo de datos** y DTOs de entrada/salida.
3. Implementar **Repository** → **Service** → **Controller** en ese orden de dependencia mental (de dentro hacia afuera).
4. Añadir validación, manejo de errores y respuestas uniformes.
5. Listar la **estructura de carpetas** creada o modificada.

## Entregables mínimos

- **Código completo** de: endpoints, servicios, repositorios, modelos (y DTOs/requests), registros de módulo o rutas según el framework.
- **Estructura del proyecto** (árbol o lista) bajo el módulo o bounded context.
- Breve nota de cómo inyectar/registrar el servicio y el repositorio.

## NestJS (pautas)

- Módulo por feature; DTOs con `class-validator` / `class-transformer`; Pipes.
- `Controller` → inyecta `*Service` → inyecta `*Repository` (o interfaz) según el patrón del repo.
- Repositorio: `TypeORM` / `Prisma` encapsulado; sin queries en el controller.

## Laravel (pautas)

- `Form Request` para validar; `Controller` delgado; `Service` para negocio.
- `Repository` o capa de datos explícita si el proyecto lo exige; el **Model** no sustituye al servicio de dominio.
- No SQL ni reglas de negocio en rutas ni en el controller.

## Comprobación final

- [ ] Cero lógica de negocio en el controller.
- [ ] Validación en el borde HTTP; errores con mensaje/código útiles.
- [ ] Acceso a datos centralizado en el repositorio (o capa equivalente).
- [ ] Sin secretos ni URLs fijas: configuración y variables de entorno.
- [ ] Código y estructura entregados; listo para pruebas del proyecto.

## Recursos

- Estructuras de carpetas de ejemplo: [reference.md](reference.md)

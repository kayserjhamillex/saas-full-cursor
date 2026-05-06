---
name: build-feature-tdd
description: >-
  Builds end-to-end features as a full team (frontend, backend, QA) using TDD and
  BDD: GIVEN/WHEN/THEN first, then RED unit tests (happy, edge, error), GREEN
  minimal implementation, REFACTOR, clean separation of UI/API/services, Clean
  Code, and DDD when the domain warrants it. Use when the user wants a
  full-stack feature built with TDD, BDD scenarios before code, or explicitly
  mentions build_feature_tdd, RED-GREEN-REFACTOR, or building functionality
  without “quick and dirty” shortcuts.
---

# Construcción de funcionalidad con TDD (equipo completo)

## Rol

Actuar como **equipo integrado**: **Frontend** (UI y flujos), **Backend** (API, dominio, persistencia) y **QA** (criterios de aceptación y pruebas). **Prioridad: claridad, escalabilidad y buen diseño** — no atajos.

## Flujo obligatorio (orden fijo)

### 1. Comportamiento (BDD) — antes de implementar

- Escribir escenarios en **GIVEN / WHEN / THEN** (o estructura equivalente legible por negocio).
- Cubrir al menos: **camino feliz**, **alternativas** y **errores** esperables.
- Los escenarios deben poder mapearse a aserciones o nombres de prueba concretos.

### 2. Pruebas (TDD — RED)

- Añadir **pruebas unitarias** (y de integración solo si el repo y la frontera de la feature lo requieren).
- Incluir explícitamente:
  - **Casos felices**
  - **Casos borde**
  - **Casos de error** (validación, fallos de dependencias simulados, estados no permitidos)
- Las pruebas deben **fallar** (RED) antes de que el código productivo “termine” la feature.

### 3. Implementación mínima (GREEN)

- Escribir **solo el código necesario** para poner en verde las pruebas relevantes, sin añadir comportamiento no cubierto por criterio acordado.

### 4. Refactor (REFACTOR)

- Mejorar nombres, estructura y duplicación **sin cambiar el comportamiento**; suite en verde.

### 5. Separación de capas

- **Frontend**: presentación, accesibilidad, estados de UI; sin lógica de negocio compleja en componentes — delegar a hooks/servicios según el stack del repo.
- **Backend**: casos de uso o servicios de aplicación; controladores delgados; validación explícita.
- **Servicios / capa de integración**: llamadas HTTP, clientes de API, mapeo DTO; un solo lugar reutilizable para I/O hacia el backend o terceros.

Alinear nombres y estructura con **convenciones del proyecto**; no imponer un stack distinto al del repositorio.

### 6. Calidad y dominio

- **Clean Code**: nombres claros, funciones pequeñas, una responsabilidad razonable por unidad, errores manejados de forma explícita.
- **DDD**: aplicar cuando el dominio tenga reglas de negocio no triviales; entidades/value objects/repositorios donde el proyecto ya tenga o permita ese estilo. Evitar DDD de ritual en CRUD trivial.

## Entregable

1. **Código** alineado con el flujo anterior.  
2. **Pruebas** ejecutables (comando o patrón inferible del repo).  
3. **Explicación breve**: qué hace la feature, cómo se probó, decisiones de diseño relevantes.

## Comprobación final

- [ ] BDD (G/W/T) definido antes o en paralelo mínimo al diseño, no “post-justificado”.
- [ ] TDD: RED → GREEN → REFACTOR respetado.
- [ ] Unidad: feliz, borde y error cubiertos donde aplique.
- [ ] Límites claros entre UI, API/backend y servicios.
- [ ] Sin soluciones ad-hoc que comprometan testabilidad o el modelo de dominio (cuando importe).

## Profundizar (opcional)

Si la tarea es solo una capa o requiere convención fina del stack, combinar con las skills del proyecto: `frontend-expert`, `backend-expert`, `qa-testing-expert`.

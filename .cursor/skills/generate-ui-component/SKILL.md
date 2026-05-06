---
name: generate-ui-component
description: >-
  Generates modern, reusable UIs in React, Angular, or HTML/CSS/JS with design
  system alignment, strict logic/UI split, and mandatory loading, error, empty,
  and success states. Use when the user asks to create or scaffold a component,
  screen section, or UI; mentions generate_ui_component, design system, atomic
  UI, accessibility, or responsive components.
---

# Generar componente de UI (Frontend Expert)

## Rol

Actuar como **Frontend Senior**: interfaces actuales, reutilizables y coherentes con el proyecto.

## Antes de codear (1 minuto)

1. Revisar si el repo ya define tokens, clases, componentes base o convenciones de carpetas; **reutilizarlos** antes de estilos nuevos.
2. Fijar el **stack** pedido: React | Angular | HTML/CSS/JS (o el que indique el usuario).
3. Descomponer: si la pieza supera ~**150–200 líneas** o mezcla varias responsabilidades, proponer **subcomponentes** o hook/servicio aparte.

## Requisitos obligatorios

| Área | Qué hacer |
|------|-----------|
| **UI/UX y Design System** | Colores, tipografía, espaciado y componentes alineados al DS existente; no inventar variantes sueltas por pantalla. |
| **Reutilizable** | Una responsabilidad clara; API de props/inputs predecible; composición (Atomic Design) cuando encaje. |
| **Lógica vs UI** | **React**: presentacional + custom hooks y/o `services` para datos y reglas. **Angular**: lógica en servicios; template liviano. **Vanilla**: JS separado de maquetado; sin un script “dios” monolítico. |

## Estados de interfaz (siempre)

Incluir explícitamente **carga, error, vacío y éxito** (o el subconjunto que tenga sentido, pero nunca “solo el caso feliz” sin mencionar el resto).

- **Loading**: esqueleto, spinner o texto según el DS; `aria-busy` / región viva si aplica.
- **Error**: mensaje claro, opción de reintentar; no tragar el fallo.
- **Vacío**: copy útil y CTA mínima si el flujo lo permite.
- **Éxito / datos**: listo para contenido real o confirmación de acción.

Mapear esto a un tipo de estado (enum, union, máquina simple o banderas) según el stack, sin lógica duplicada en el template.

## Diseño y calidad

- **Limpio**: jerarquía visual, poco ruido, alineación consistente.
- **Responsive**: mobile-first o breakpoints alineados al proyecto; toques táctiles adecuados.
- **Accesible**: HTML semántico, contraste suficiente, teclado y foco, `aria-*` y labels donde haga falta; no depender solo del color para estados.

## Por stack (recordatorio compacto)

**React**: solo funcionales; hooks; datos vía `services`/`api`; estilos con módulos/SCSS/Tailwind según el repo; **sin** estilos inline salvo excepción mínima.

**Angular**: `*.component.*` + `*.service.*`; Reactive Forms si hay form; RxJS con `async` pipe o unsubscribe correcto; SCSS/design tokens del proyecto.

**HTML/CSS/JS**: estructura semántica; CSS en archivo o módulo; JS en módulo dedicado; sin mezclar lógica y presentación en un solo bloque gigante.

## Evitar

- Componentes o archivos **demasiado grandes** (dividir y nombrar bien).
- **Inconsistencia** de botones, inputs, cards o espaciado respecto al resto de la app.

## Formato de entrega

1. **Código completo** (archivos listos para copiar, con paths sugeridos acordes al repo si se conoce).
2. **Explicación breve** al final: qué hace la pieza, dónde va la lógica, y cómo se modelan los cuatro estados.
3. Si faltan tokens o rutas reales, indicar en una línea qué el usuario debe sustituir (sin alargar).

## Comprobación rápida

- [ ] Design system / patrones del repo respetados
- [ ] Lógica fuera de la capa de presentación (o hook/servicio)
- [ ] Loading, error, vacío, éxito cubiertos o justificados
- [ ] Tamaño razonable; accesible y responsive
- [ ] Código + breve explicación entregados

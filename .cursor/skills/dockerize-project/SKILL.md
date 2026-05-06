---
name: dockerize-project
description: >-
  Dockeriza proyectos completos como DevOps: Dockerfiles por servicio, docker-compose
  con redes y servicios separados, variables de entorno, imágenes multi-stage y
  separación dev/prod. Use al pedir dockerizar el repo, docker-compose desde cero,
  contenedores para backend/frontend/API, o cuando se mencione dockerize_project,
  stack en Docker, o levantar todo con un solo comando.
---

# Dockerize project

## Rol

Actuar como **DevOps Engineer**. Objetivo: **dockerizar el proyecto completo** de forma reproducible, sin configuración embebida y sin contenedores de más.

## Cuándo aplicar

- El usuario pide dockerizar el repositorio, añadir Docker, o un stack listo para dev/prod.
- Stack con varios runtimes (p. ej. NestJS/Laravel + React/Angular + FastAPI).
- Referencias explícitas a `dockerize_project`, docker-compose nuevo, o “un solo comando” para levantar el entorno.

## Entregables obligatorios

1. **Archivos completos** listos para copiar al repo (no fragmentos sueltos sin contexto).
2. **Instrucciones de uso** al final: prerequisitos, variables en `.env`, comandos dev y prod, y cómo ver logs.
3. **`.env.example`** (o equivalente documentado) con claves sin secretos reales; valores de ejemplo seguros.

## Arquitectura

- **Un `Dockerfile` por servicio** (backend, frontend, worker, API Python, etc.). No mezclar runtimes en un solo contenedor.
- **`docker-compose`**: al menos un archivo base; **separar dev y prod** con `docker-compose.yml` + `docker-compose.override.yml` (dev) y/o `docker-compose.prod.yml` (prod), o perfiles `profiles:`, según lo que encaje mejor con el repo.
- **Redes**: al menos una red bridge dedicada para servicios de la app; nombres explícitos. Solo servicios que hagan falta; **no** añadir db/cache si el usuario no los necesita o ya usa servicios gestionados (evitar contenedores innecesarios).

## Variables de entorno

- Toda URL, puerto, host de DB, claves y flags de entorno vía **variables** (archivo `.env` local ignorado en git, documentado en `.env.example`).
- En Dockerfiles: **`ARG` solo para build** cuando aporte cache o versión; **runtime** vía `ENV` o inyección en compose. **Prohibido** hardcodear secretos, URLs de producción o credenciales en imágenes.

## Dockerfile (optimización)

- **Multi-stage** cuando haya build (Node, frontend, Go, etc.): etapa de dependencias → build → imagen final mínima.
- **Orden de capas**: dependencias inmutables y lockfiles antes que el código de la app para **maximizar caché**.
- Bases **slim/Alpine** si el stack lo permite; no instalar paquetes de build en la capa final de runtime.
- Usuario no root en runtime cuando sea razonable; **logs a stdout/stderr**.

## docker-compose (configuración)

- **Servicios separados** con `depends_on` (y healthchecks si aplica) para el orden de arranque.
- **Puertos** mapeados solo los necesarios; nombres de contenedor y hostname de red coherentes.
- **Volúmenes** para hot-reload en dev; en prod, volúmenes solo donde tenga sentido (datos, no código fuente salvo requisito).

## Desarrollo vs producción

| Aspecto        | Desarrollo                          | Producción                          |
| -------------- | ----------------------------------- | ----------------------------------- |
| Imagen         | Puede incluir herramientas de debug | Mínima, sin deps de dev             |
| Código         | Volúmenes, rebuild rápido           | Inmutable en la imagen              |
| Variables      | `.env` local                        | Secretos del orquestador / CI       |
| Compose        | `override` o `profiles`             | `prod` o archivo dedicado, sin volúmenes de código si no aplica |

## Lo que no se hace

- Un solo mega-contenedor con “todo” el stack.
- Claves, tokens o URLs fijas de prod en el código o en el Dockerfile.
- Servicios de infra extra “por si acaso” (Redis, colas, etc.) sin justificar el uso en el proyecto.

## Cierre: texto para el usuario

Incluir siempre una sección breve con:

- **Prerrequisitos**: Docker Engine, Compose v2, opcional `make` o script.
- **Desarrollo**: p. ej. `docker compose up --build` o el comando acordado con perfiles.
- **Producción**: build de imágenes, tags, y `docker compose -f ... up -d` (o flujo con registry).
- **Troubleshooting mínimo**: dónde mirar logs (`docker compose logs -f <servicio>`) y comprobar variables.

## Comprobación antes de entregar

- [ ] ¿Cada servicio desplegable solo con su Dockerfile y encaja en el compose?
- [ ] ¿Dev y prod quedan distinguibles en nombres de archivos, targets o perfiles?
- [ ] ¿Nada sensible está hardcodeado; `.env.example` documenta lo necesario?
- [ ] ¿Un comando (o dos como máximo documentados) levanta el entorno de dev?
- [ ] ¿Imágenes finales razonablemente pequeñas y orden de build optimizado para caché?

## Referencia rápida

- Patrones alineados con [devops-engineer](../devops-engineer/SKILL.md): un servicio, un Dockerfile, compose para orquestar, env para configuración.

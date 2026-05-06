# Controller Orchestration Convention

Esta convencion formaliza el patron aplicado en los microservicios NestJS para
mantener controllers delgados y consistentes.

## Objetivo

- Controllers sin logica de negocio.
- Controllers enfocados en entrada/salida HTTP y delegacion.
- Validaciones encapsuladas en DTOs con fabricas `from()`.

## Patron obligatorio

### 1) Controller

- Define rutas (`@Get`, `@Post`, etc.).
- Recibe `params`, `query`, `headers`, `body`.
- Orquesta llamadas a:
  - `*.dto.ts` (normalizacion y validacion de input)
  - servicio de aplicacion o dominio correspondiente.
- No accede a repositorios.
- No implementa reglas de negocio.

### 2) DTO de entrada (`from()`)

- Archivo recomendado:
  - `src/controllers/dto/*.dto.ts`
  - o en feature modules: `src/<feature>/presentation/dto/*.dto.ts`
- Cada DTO expone `static from(payload)` para:
  - normalizar strings (`trim`)
  - validar requeridos y formatos
  - convertir tipos cuando aplique (ej. fechas ISO)
- Lanza `BadRequestException` cuando aplica.
- Debe devolver un objeto inmutable y listo para capa de aplicacion.

### 3) Service de negocio

- Ejecuta caso de uso.
- Orquesta reglas de dominio y persistencia.
- No conoce detalles de transporte HTTP.

## Naming

- DTOs:
  - comandos: `create-*.dto.ts`, `register-*.dto.ts`, `transfer-*.dto.ts`
  - queries: `get-*-query.dto.ts`
- Clases en PascalCase (`CreateTenantDto`, `GetStockQueryDto`, etc.).
- Metodos de construccion: `static from(...)`.
- Evitar crear nuevos `*RequestValidationService` en controllers.

## Checklist de PR

- [ ] Controller sin reglas de negocio.
- [ ] Sin acceso directo a repositorios desde controller.
- [ ] Validaciones de entrada en DTO `from()`.
- [ ] Casos de error de validacion cubiertos en tests.
- [ ] Lint y tests del servicio en verde.

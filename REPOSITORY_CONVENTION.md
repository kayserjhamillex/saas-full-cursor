# Repository Convention

Esta convencion define el estandar para la capa de repositorios en los microservicios.

## Objetivo

- Centralizar acceso a datos en `src/repositories/*`.
- Mantener queries legibles, reutilizables y consistentes.
- Separar persistencia de la logica de aplicacion.

## Patron obligatorio

### 1) Repository = acceso a datos

- Un repositorio no contiene reglas de negocio.
- Controllers y services no ejecutan SQL directo.
- El repositorio retorna objetos mapeados al modelo de dominio/response.

### 2) Queries como constantes

- Declarar queries SQL en constantes `const` al inicio del archivo.
- Naming recomendado:
  - `*_COLUMNS` para columnas reutilizadas.
  - `*_QUERY` para sentencias SQL.
- Evitar SQL inline dentro de metodos salvo casos puntuales muy simples.

### 3) Tipos de fila (`*Row`)

- Definir tipos por tabla/resultado (`EmployeeRow`, `AssetRow`, etc.).
- Evitar `any` y evitar `Record<string, unknown>` cuando haya tipo conocido.
- Convertir tipos numericos/fechas al mapear (`Number(...)`, fechas, nullables).

### 4) Mapeo explicito

- Crear metodos privados `map*` para transformar filas DB a entidades.
- Reusar mapeadores en todos los metodos del repositorio.

### 5) Manejo transaccional

- Cuando haya transacciones, usar `TransactionRunnerService`.
- El repositorio recibe `PoolClient` solo cuando el caso lo requiera.
- No duplicar `BEGIN/COMMIT/ROLLBACK` en servicios.

## Checklist de PR

- [ ] No hay SQL directo en controllers/services.
- [ ] Queries extraidas a constantes con nombres claros.
- [ ] Tipos `*Row` definidos para resultados.
- [ ] Mapeadores `map*` aplicados en retornos.
- [ ] Lint y tests en verde del servicio afectado.

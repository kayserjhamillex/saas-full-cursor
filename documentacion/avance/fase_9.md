# Avance Fase 9 - Gestion de Patrimonio y Activos

## Fecha de implementacion

2026-04-21

## Servicios implementados

- assets-service
- api-gateway (integracion de rutas de patrimonio)

## Funcionalidades completadas

- registro de activos
  - validacion de categoria por tenant
  - persistencia de metadata de vida util y valor actual
- asignaciones de activos
  - validacion de empleado activo en RRHH
  - restriccion de una asignacion activa por activo
- movimientos de activos
  - soporte de transfer, maintenance, retirement y return
  - actualizacion de estado del activo segun tipo de movimiento
- depreciacion de activos
  - registro de depreciacion por periodo
  - actualizacion de valor residual del activo
  - salida de impacto financiero para integracion contable

## Integracion con otros modulos validada

- api-gateway valida tenant y JWT antes de reenviar a assets-service
- assets-service valida empleados consultando tabla de RRHH (`employees`)
- assets-service expone `financialImpact` para registrar depreciacion en finanzas

## Reglas aplicadas

- todo activo pertenece a un tenant y categoria valida
- un activo no puede tener mas de una asignacion activa simultanea
- todo movimiento de activo se registra en historial
- la depreciacion nunca reduce el activo por debajo de cero
- toda operacion sensible se ejecuta con transacciones SQL (`BEGIN/COMMIT/ROLLBACK`)

## Pruebas ejecutadas

- prueba de registro de activo con categoria valida
- prueba de rechazo de activo con categoria inexistente
- prueba de asignacion de activo a empleado del tenant
- prueba de rechazo por activo ya asignado
- prueba de movimiento de mantenimiento y actualizacion de estado
- prueba de depreciacion mensual con actualizacion de valor

## Problemas encontrados

- no existia `assets-service` en el monorepo y se creo desde cero
- no existian rutas de patrimonio en `api-gateway`
- faltaba documentacion de pruebas de fase 9 en manual de usuario

## Decisiones tecnicas

- mantener la misma arquitectura de fases previas:
  - controllers
  - services
  - repositories
- centralizar reglas de negocio en servicios para coherencia de dominio
- usar eventos de salida (`asset_created`, `asset_assigned`, `asset_moved`, `asset_depreciated`)
- documentar SQL y curl de fase 9 en el manual para validacion E2E local

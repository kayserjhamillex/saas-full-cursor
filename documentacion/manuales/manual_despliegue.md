# Manual de Despliegue

## 1. Objetivo

Establecer el proceso estandar de despliegue del sistema `saasodontologico` en un entorno objetivo (staging o produccion), con controles de seguridad y validacion post-despliegue.

## 2. Alcance

Aplicable al equipo tecnico responsable de infraestructura, backend, frontend y operacion del servicio.

## 3. Requisitos previos

- Acceso al servidor o plataforma de hosting.
- Dominio y subdominios definidos.
- Certificados TLS/HTTPS disponibles.
- Variables de entorno de produccion preparadas.
- Respaldos de base de datos y archivos antes del despliegue.

## 4. Checklist pre-despliegue

- Congelar cambios no criticos en rama de release.
- Confirmar version/commit que se desplegara.
- Verificar estado de migraciones requeridas.
- Validar conectividad de servicios externos.
- Preparar plan de rollback.

## 5. Preparacion de entorno

1. Crear/actualizar archivo de entorno de produccion con:
- credenciales de base de datos
- secretos JWT
- URLs de microservicios
- credenciales de servicios externos

2. Revisar permisos de archivos y usuarios del sistema operativo.
3. Asegurar acceso por SSH restringido y autenticado.

## 6. Ejecucion de despliegue

### 6.1 Actualizar codigo

```bash
git fetch --all
git checkout <rama_release>
git pull origin <rama_release>
```

### 6.2 Construccion y arranque

Si el despliegue usa Docker Compose:

```bash
docker compose -f docker/docker-compose.yml pull
docker compose -f docker/docker-compose.yml up -d --build
```

Si el despliegue usa procesos Node/Python nativos, aplicar el procedimiento equivalente del entorno objetivo.

### 6.3 Migraciones

Ejecutar migraciones de base de datos antes de habilitar trafico completo, segun el mecanismo definido por cada servicio.

## 7. Validacion post-despliegue

Validar al menos:

- `GET /health` en servicios criticos.
- `GET /metrics` en gateway y servicios con observabilidad activa.
- Flujo de autenticacion (login/token).
- Flujo funcional minimo (crear/consultar entidad principal).
- Registro en auditoria y logs de acceso.

## 8. Seguridad operativa minima

- Forzar HTTPS en frontend y API.
- Restringir origenes CORS al dominio oficial.
- Rotar secretos periodicamente.
- Proteger respaldos y registros con controles de acceso.
- Revisar alertas de intentos de acceso no autorizado.

## 9. Monitoreo y observabilidad

- Confirmar objetivos `UP` en Prometheus.
- Verificar dashboards en Grafana.
- Configurar alertas para:
  - servicio caido
  - saturacion de recursos
  - incremento de errores HTTP 5xx

## 10. Plan de rollback

Ante una falla critica:

1. Detener despliegue actual.
2. Restaurar version anterior estable.
3. Restaurar base de datos si hubo cambio incompatible.
4. Verificar salud y funcionalidad minima.
5. Registrar incidente y causa raiz.

## 11. Soporte inicial post-lanzamiento

- Monitoreo intensivo durante la primera ventana operativa.
- Registro de incidentes por severidad (critico/alto/medio/bajo).
- Comunicacion interna de estado hasta estabilizacion.

## 12. Evidencia recomendada

- Hash/commit desplegado.
- Capturas de salud y targets de monitoreo.
- Resultado de smoke tests.
- Registro de fecha y responsables del despliegue.

## 13. Referencias

- `documentacion/instrucciones/fase_18_lanzamiento_operacion.md`
- `documentacion/instrucciones/fase_15_obserbabilidad_monitoreo.md`
- `documentacion/instrucciones/fase_14_seguridad_avanzada.md`

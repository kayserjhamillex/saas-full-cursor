# Fase 18 — Lanzamiento, Operación y Crecimiento del SaaS

---

1. Descripción de la fase

Esta fase formaliza la puesta en producción del sistema SaaS clínico y establece los procesos de operación continua, soporte, crecimiento y mejora del producto.

Se enfoca en convertir el sistema desarrollado en un servicio activo, utilizado por clientes reales, con mecanismos de soporte, monitoreo operativo y evolución continua.

---

2. Objetivo técnico

Implementar y ejecutar:

* Despliegue en entorno productivo (VPS / hosting)
* Configuración de dominios y certificados HTTPS
* Alta del primer tenant real
* Procesos de soporte y mantenimiento
* Estrategia de crecimiento del sistema

---

3. Componentes involucrados

/apps/*
/frontend/*
/ai-service
/services/*
/docker
/config
/documentacion
/documentacion/avance

---

4. Responsabilidades por componente

Infraestructura

* Despliegue en servidor
* Configuración de red
* Seguridad de acceso

---

Backend

* Verificación de servicios activos
* Monitoreo de endpoints
* Validación de logs

---

Frontend

* Publicación de aplicaciones
* Verificación de experiencia de usuario

---

Servicios externos

* Validación de envío de notificaciones
* Validación de almacenamiento de archivos

---

5. Flujo de lanzamiento

El flujo recomendado de lanzamiento en produccion es:

1) Preparacion pre-go-live
- congelar cambios no criticos
- validar estado de ramas y version desplegable
- confirmar respaldos de base de datos y archivos

2) Validacion de infraestructura
- verificar VPS/hosting activo y con recursos suficientes
- validar configuracion de red, firewall y puertos necesarios
- confirmar certificados TLS vigentes

3) Despliegue tecnico
- actualizar variables de entorno de produccion
- aplicar migraciones/DDL pendientes
- publicar servicios backend, frontend y servicios externos
- validar healthchecks por servicio

4) Smoke test de negocio
- alta de tenant real inicial
- login y validacion de modulo por gateway
- flujo minimo clinico/operativo validado end-to-end

5) Activacion y monitoreo reforzado
- habilitar trafico de usuarios reales
- monitoreo intensivo primeras 24-72 horas
- registro de incidencias y acciones correctivas

---

6. Despliegue en servidor

Checklist tecnico minimo:

- provisionar servidor Linux estable (2 vCPU, 4 GB RAM minimo para entorno inicial)
- instalar Docker/Docker Compose y runtime Node/Python segun arquitectura
- configurar usuario de despliegue sin privilegios root para operacion diaria
- asegurar puertos requeridos y restringir acceso administrativo por IP
- configurar rotacion de logs y politicas de reinicio de contenedores/procesos

Comandos base referenciales:

- `docker compose -f docker/docker-compose.yml up -d`
- `docker ps`
- `curl http://localhost:3000/health`
- `curl http://localhost:3001/health`
- `curl http://localhost:3002/health`

---

7. Configuración de base de datos

Lineamientos de produccion:

- usar credenciales distintas a desarrollo y no versionar secretos
- habilitar backup automatico diario y prueba de restauracion semanal
- validar indices y crecimiento de tablas criticas (`tenants`, `subscriptions`, `payments`, modulos clinicos/ERP)
- establecer monitoreo de conexiones activas, latencia y consumo de almacenamiento

Validaciones minimas:

- conexion exitosa desde servicios backend
- tablas esperadas creadas sin errores
- tenant inicial persistido correctamente

---

8. Configuración de dominios

Pasos recomendados:

1. Configurar DNS (`A`/`CNAME`) para frontend y API.
2. Apuntar reverse proxy (Nginx/Caddy/Traefik) a servicios internos.
3. Emitir o renovar certificado SSL (Let's Encrypt o proveedor).
4. Forzar HTTPS y redireccion HTTP -> HTTPS.
5. Validar cabeceras de seguridad basicas (`HSTS`, `X-Content-Type-Options`, `X-Frame-Options`).

Resultado esperado:

- frontend accesible por dominio publico
- gateway accesible por dominio seguro
- trafico cifrado extremo a extremo

---

9. Pruebas en producción

Pruebas minimas de salida:

- `GET /health` y `GET /metrics` en servicios criticos
- login correcto y rechazo con credenciales invalidas
- validacion de tenant/modulo activo por gateway
- creacion de al menos un registro funcional (paciente/cita/movimiento segun modulo activo)
- envio de una notificacion externa (email o WhatsApp) y verificacion en logs
- consulta de trazabilidad en `audit_logs` y `access_logs`

Criterio de aprobacion:

- no existen errores bloqueantes en flujos criticos
- errores menores documentados con plan de correccion

---

10. Activación del sistema

Activacion controlada:

- habilitar acceso para tenant piloto
- monitorear primer ciclo operativo completo (inicio de sesion, operacion, cierre)
- registrar decisiones de operacion (horarios de soporte, canales de atencion, responsables)

Plan de rollback minimo:

- respaldo previo confirmado
- version anterior disponible para redeploy rapido
- procedimiento documentado de reversa de configuracion

---

11. Registro de primeros usuarios

Recomendaciones de onboarding inicial:

- crear usuarios administradores por tenant con correo verificado
- asignar rol base (`admin`) y permisos minimos necesarios
- registrar capacitacion breve de uso de plataforma
- documentar incidencias de adopcion temprana

---

6. Operación del sistema

Actividades continuas:

* monitoreo constante de disponibilidad y rendimiento
* revision diaria de logs operativos y de seguridad
* atencion de errores segun severidad (critico/alto/medio/bajo)
* mantenimiento preventivo planificado (actualizaciones, limpieza, backups)
* gestion de capacidad (CPU, memoria, almacenamiento)

---

7. Soporte

Modelo minimo de soporte:

* atencion a usuarios por canal definido (correo, mesa de ayuda o chat)
* resolucion de incidencias con SLA acordado
* gestion de tickets con trazabilidad de estado
* base de conocimiento de problemas frecuentes

---

8. Mejora continua

* recopilacion de feedback de clientes y usuarios internos
* iteracion de funcionalidades segun impacto de negocio
* optimizacion del sistema en tiempos de respuesta y experiencia
* priorizacion de roadmap con base en evidencia operativa

---

9. Métricas de negocio

* numero de tenants activos
* usuarios activos diarios/semanales/mensuales
* ingresos generados por suscripcion y modulos
* tasa de retencion y churn
* tiempo promedio de resolucion de incidencias (MTTR)

---

10. Reglas de negocio

* el sistema debe mantener disponibilidad operativa definida por SLA
* los errores criticos deben resolverse en ventana corta y trazable
* la experiencia del usuario es prioritaria en decisiones de evolutivo
* el acceso por tenant debe respetar aislamiento y seguridad

---

11. Seguridad

* monitoreo de accesos y eventos anomalos
* actualizacion constante de dependencias y parches
* control de vulnerabilidades con escaneo periodico
* renovacion de secretos y certificados segun politica interna

---

12. Testing

* validacion en produccion mediante smoke tests controlados
* pruebas de aceptacion con tenant piloto
* pruebas de usuario para adopcion y usabilidad
* re-ejecucion de pruebas criticas luego de cada despliegue relevante

---

13. Dependencias técnicas

* VPS / hosting
* Docker
* dominios y SSL
* herramientas de monitoreo

---

14. Riesgos técnicos

* fallos en produccion por configuracion o despliegue incompleto
* caidas del sistema por saturacion de recursos o dependencia externa
* errores no detectados por falta de pruebas de regresion
* problemas de escalabilidad inicial ante crecimiento acelerado
* incidentes de seguridad por gestion inadecuada de secretos

---

15. Resultado esperado

* sistema en produccion con monitoreo activo
* usuarios y tenant iniciales operando sin bloqueos criticos
* operacion estable con soporte y procesos definidos
* producto SaaS funcionando en ciclo real de negocio

---

16. Registro de avance (documentacion/avance)

Se debe generar:

/documentacion/avance/fase_18.md

Contenido:

* Fecha de lanzamiento
* Entorno de despliegue
* Usuarios iniciales
* Estado del sistema
* Problemas encontrados
* Acciones correctivas
* Métricas iniciales

---

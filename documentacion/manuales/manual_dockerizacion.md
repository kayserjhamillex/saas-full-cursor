# Manual: Dockerizar el proyecto completo (SaaS odontológico)

Este documento describe, paso a paso, cómo pasar de un entorno donde solo la base de datos (u otros servicios de datos) corre en Docker, a levantar **toda la plataforma** en contenedores: microservicios Node/Nest, servicios auxiliares, frontend, IA (Python) y observabilidad.

El repositorio ya incluye la definición principal en `docker/docker-compose.yml` y los Dockerfiles en `docker/`. El trabajo consiste en **preparar el entorno**, **configurar variables** y **ejecutar Compose** desde la carpeta correcta.

---

## 1. Qué vas a obtener

Al usar el `docker-compose.yml` completo tendrás, entre otros:

| Capa | Servicios en Compose |
|------|----------------------|
| Datos y mensajería | `postgres`, `redis`, `rabbitmq` |
| API y dominio | `api-gateway`, `auth-service`, `core-service`, `clinical-service`, `inventory-service`, `hr-service`, `financial-service`, `assets-service`, `scheduling-service` |
| Integraciones | `email-service`, `whatsapp-service`, `file-service` |
| IA | `ai-service` (FastAPI/Uvicorn) |
| Frontend | `demo-app`, `react-app`, `angular-app` |
| Observabilidad | `prometheus`, `grafana` |

Los **contextos de build** apuntan a carpetas del monorepo (`apps/`, `services/`, `frontend/`, `ai-service/`). No hace falta copiar el código fuera del repositorio.

---

## 2. Requisitos previos

1. **Docker Desktop** instalado en Windows (recomendado con backend WSL2).
2. **Git** y el repositorio clonado en `d:\proyectos\saasodontologico` (o la ruta que uses).
3. **Espacio en disco** suficiente: la primera construcción descarga imágenes base y genera muchas capas de `node_modules` por servicio.
4. **Puertos libres** en el host (ver sección 8). Si algo ya escucha en un puerto, Compose fallará al mapear ese puerto.

Comprueba que Docker responde:

```powershell
docker version
docker compose version
```

---

## 3. Dónde está la configuración

- **Orquestación:** `docker/docker-compose.yml`
- **Imagen Node (Nest):** `docker/Dockerfile.node-service` — instala dependencias con `npm ci`, ejecuta `npm run build` y arranca con `npm run start:prod`.
- **Frontends Vite:** `docker/Dockerfile.frontend-vite` — modo desarrollo con servidor escuchando en `0.0.0.0`.
- **Frontend Angular:** `docker/Dockerfile.frontend-angular` — `ng serve` en el puerto configurado.
- **IA:** `docker/Dockerfile.ai-service` — Python 3.12, `requirements.txt`, Uvicorn.
- **Variables por entorno:** `config/env/.env.development`, `.env.staging`, `.env.production` (según variable `APP_ENV`).

Los servicios Node que llevan `env_file` cargan:

`../config/env/.env.${APP_ENV:-development}`

Es decir, por defecto se usa **development** si no defines `APP_ENV`.

---

## 4. Paso a paso: preparar variables

### 4.1 Credenciales de PostgreSQL

En el mismo directorio desde el que ejecutarás `docker compose` (normalmente `docker/`), puedes definir variables en un archivo `.env` **junto al compose** o exportarlas en la terminal. El compose ya define valores por defecto, por ejemplo:

- `POSTGRES_USER` (por defecto `postgres`)
- `POSTGRES_PASSWORD` (por defecto `123`)
- `POSTGRES_DB` (por defecto `saasodontologico`)
- `POSTGRES_PORT` (mapeo host, por defecto `5432`)

**Importante:** para entornos reales, cambia contraseñas y secretos; no uses los valores de ejemplo en producción.

### 4.2 JWT y Redis

- `JWT_SECRET`: el compose incluye un valor de desarrollo; sustitúyelo en producción.
- `REDIS_URL`: por defecto apunta a `redis://redis:6379` dentro de la red Docker (correcto para contenedores).

### 4.3 RabbitMQ

- `RABBITMQ_USER` / `RABBITMQ_PASSWORD` (por defecto `guest` / `guest`).
- `RABBITMQ_URL` para consumidores (por defecto apunta al host `rabbitmq` dentro de la red).

### 4.4 Entorno de aplicación (`APP_ENV`)

Si quieres cargar otro archivo de `config/env/`, exporta antes, por ejemplo:

```powershell
$env:APP_ENV = "staging"
```

Asegúrate de que exista `config/env/.env.staging`.

### 4.5 URL del API para los frontends

En `docker-compose.yml`, las apps Vite usan `VITE_API_URL` y Angular `API_URL`, con valor por defecto `http://localhost:3000/gateway`.

Eso es adecuado cuando el **navegador** en tu PC llama al gateway publicado en `localhost:3000`. Si despliegas detrás de un dominio o HTTPS, deberás ajustar esas variables **en el momento del build** (Vite inyecta variables en build time) o según la estrategia que defina el equipo.

---

## 5. Paso a paso: construir y levantar todo el stack

Desde PowerShell:

```powershell
Set-Location "d:\proyectos\saasodontologico\docker"
docker compose up --build
```

- La primera vez **tarda** (muchas imágenes y `npm ci` / `npm install` por servicio).
- Para ejecutar en segundo plano:

```powershell
docker compose up --build -d
```

Para ver solo los logs de un servicio:

```powershell
docker compose logs -f api-gateway
```

---

## 6. Transición desde “solo base de datos en Docker”

Si hoy solo levantas Postgres (o Postgres + Redis + Rabbit) con Docker y el resto con scripts como `levantar_todo.bat`:

1. **Detén** las ventanas de `npm run start:dev` y procesos locales que usen los mismos puertos (3000–3013, 4173, 5173, 4200, 8000, etc.).
2. Opcional: levanta **solo infraestructura** para probar migraciones o datos antes de los microservicios:

   ```powershell
   docker compose up -d postgres redis rabbitmq
   ```

3. Cuando quieras el stack completo, ejecuta `docker compose up --build` sin limitar servicios.

Así evitas dos instancias de PostgreSQL compitiendo por el puerto **5432** del host.

---

## 7. Base de datos y esquema

Los microservicios Nest se conectan a Postgres usando variables `DB_HOST=postgres`, `DB_PORT=5432`, etc. (nombres de **servicio** de Docker, no `localhost`).

Después de que Postgres esté arriba, aplica el procedimiento que use el proyecto para **crear tablas o migraciones** (scripts SQL, herramienta interna, etc.). Este manual no sustituye ese procedimiento; sin esquema y datos mínimos, los servicios pueden fallar al arrancar o al recibir tráfico.

---

## 8. Puertos útiles (host → contenedor)

| Puerto host | Servicio |
|-------------|----------|
| 5432 | PostgreSQL |
| 6379 | Redis |
| 5672 / 15672 | RabbitMQ (AMQP / consola management) |
| 3000 | api-gateway |
| 3001–3008 | resto de microservicios (auth, core, clinical, inventory, hr, financial, assets, scheduling) |
| 3011–3013 | email, whatsapp, file |
| 8000 | ai-service |
| 4173 / 5173 / 4200 | demo-app (Vite preview), react-app, angular-app |
| 9090 | Prometheus |
| 3009 | Grafana (mapeado al 3000 interno; usuario/contraseña por defecto en compose: revisar `docker-compose.yml`) |

Si un puerto choca con otra app, cambia el mapeo en `docker-compose.yml` (lado izquierdo `HOST:CONTAINER`) y actualiza URLs en clientes o variables relacionadas.

---

## 9. Redes Docker

El compose define tres redes:

- `backend`: servicios de API, datos, colas, IA.
- `frontend`: frontends (dependen del gateway según el servicio).
- `observability`: Prometheus y Grafana.

Los contenedores se resuelven entre sí por **nombre de servicio** (`postgres`, `api-gateway`, etc.).

---

## 10. Observabilidad

- Prometheus lee `docker/prometheus.yml` montado como volumen de solo lectura.
- Grafana depende de Prometheus en el mismo compose.

Úsalos para validar que los targets y dashboards reflejan los hosts correctos dentro de Docker.

---

## 11. Detener y limpiar

```powershell
Set-Location "d:\proyectos\saasodontologico\docker"
docker compose down
```

Para borrar también el volumen de datos de Postgres (¡pierdes datos persistentes!):

```powershell
docker compose down -v
```

---

## 12. Problemas frecuentes (Windows)

1. **“Puerto ya en uso”:** identifica el proceso con `netstat -ano | findstr ":3000"` (ajusta el puerto) y cierra la app local o cambia el mapeo en Compose.
2. **Ruta incorrecta:** los `build.context` del compose son relativos a la carpeta `docker/`; ejecuta siempre `docker compose` **desde** `docker/` para que resuelvan bien `../apps/...`.
3. **Build lento o fallos de red:** configura mirrors o reintenta; Docker Desktop debe tener salida a internet para `npm` y `pip`.
4. **Credenciales:** si cambias `POSTGRES_USER` o `POSTGRES_PASSWORD`, deben coincidir con lo que esperan los servicios en `environment` y en `config/env/.env.*`.

---

## 13. Próximos pasos recomendados para producción

- Imágenes multi-stage más pequeñas, usuario no root y escaneo de vulnerabilidades.
- Secretos con Docker Secrets, Vault o el mecanismo del orquestador (Kubernetes, ECS, etc.).
- `API_URL` / CORS y TLS terminados en reverse proxy (Traefik, Nginx, cloud load balancer).
- Perfiles Compose (`profiles`) para separar `infra`, `backend`, `frontend` y no levantar Grafana en cada máquina de desarrollo, si el equipo lo desea.

---

## Referencia rápida de comandos

```powershell
cd d:\proyectos\saasodontologico\docker
docker compose up --build -d
docker compose ps
docker compose logs -f api-gateway
docker compose down
```

Con esto tienes el camino documentado para **dockerizar el proyecto completo** usando la configuración ya presente en el repositorio, y el contraste claro con el enfoque anterior centrado solo en la base de datos.
